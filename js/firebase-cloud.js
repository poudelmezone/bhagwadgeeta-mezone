/* Native Firebase login and per-user cloud backup for the Android APK. */
(function () {
  'use strict';

  const capacitor = window.capacitorExports;
  const native = !!(capacitor && capacitor.Capacitor && capacitor.Capacitor.isNativePlatform());
  const registerPlugin = capacitor && capacitor.registerPlugin;
  const authPlugin = native && registerPlugin ? registerPlugin('FirebaseAuthentication') : null;
  const cloudPlugin = native && registerPlugin ? registerPlugin('FirebaseCloudSync') : null;
  let ready = false;
  let syncing = false;
  let timer = null;
  let lastError = '';

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function googleUser(user) {
    if (!user || !user.uid) throw new Error('Google sign-in did not return an account.');
    return {
      provider: 'google', uid: user.uid, name: user.displayName || 'Google user',
      email: user.email || '', picture: user.photoUrl || user.photoURL || null,
    };
  }
  function timestamp(value) {
    if (typeof value === 'number') return value;
    return Number(value && (value.ts || value.updatedAt || value.lastUpdated)) || 0;
  }
  function mergeTimestampMaps(a, b) {
    const result = Object.assign({}, a || {});
    for (const [key, value] of Object.entries(b || {})) {
      if (!(key in result) || timestamp(value) >= timestamp(result[key])) result[key] = value;
    }
    return result;
  }
  function mergeTombstones(a, b) {
    const out = {};
    for (const type of ['notes', 'prayers', 'highlights']) {
      out[type] = mergeTimestampMaps((a || {})[type], (b || {})[type]);
    }
    return out;
  }
  function mergeItems(localItems, remoteItems, tombstones) {
    const byId = new Map();
    for (const item of [...(remoteItems || []), ...(localItems || [])]) {
      if (!item || !item.id) continue;
      const old = byId.get(item.id);
      if (!old || timestamp(item) >= timestamp(old)) byId.set(item.id, item);
    }
    return Array.from(byId.values())
      .filter((item) => timestamp(item) > (Number(tombstones[item.id]) || 0))
      .sort((a, b) => timestamp(b) - timestamp(a));
  }
  function mergeState(local, remote) {
    const localIsNewer = Number(local._savedAt || 0) >= Number(remote._savedAt || 0);
    const newer = localIsNewer ? local : remote;
    const older = localIsNewer ? remote : local;
    const merged = Object.assign({}, older, newer);
    for (const key of ['lang', 'tab', 'last', 'settings', 'plan', 'profileTab', 'refSort']) {
      merged[key] = newer[key] !== undefined ? newer[key] : older[key];
    }
    merged.read = mergeTimestampMaps(local.read, remote.read);
    merged.introRead = mergeTimestampMaps(local.introRead, remote.introRead);
    merged.chaptersRead = mergeTimestampMaps(local.chaptersRead, remote.chaptersRead);
    merged.tombstones = mergeTombstones(local.tombstones, remote.tombstones);
    merged.highlights = mergeTimestampMaps(local.highlights, remote.highlights);
    for (const [key, deletedAt] of Object.entries(merged.tombstones.highlights)) {
      if (timestamp(merged.highlights[key]) <= Number(deletedAt)) delete merged.highlights[key];
    }
    merged.notes = mergeItems(local.notes, remote.notes, merged.tombstones.notes);
    merged.prayers = mergeItems(local.prayers, remote.prayers, merged.tombstones.prayers);
    merged.streak = Object.assign({}, older.streak || {}, newer.streak || {});
    merged.streak.best = Math.max((local.streak || {}).best || 0, (remote.streak || {}).best || 0);
    merged.streak.days = Array.from(new Set([
      ...((local.streak || {}).days || []), ...((remote.streak || {}).days || []),
    ])).sort().slice(-60);
    merged.history = Array.from(new Set([...(newer.history || []), ...(older.history || [])])).slice(0, 12);
    merged._savedAt = Math.max(Number(local._savedAt || 0), Number(remote._savedAt || 0));
    merged.auth = G.state.auth;
    return merged;
  }
  function emitRestored() {
    window.dispatchEvent(new CustomEvent('gita-cloud-restored'));
  }
  async function restore(user) {
    ready = false;
    const profile = googleUser(user);
    const local = clone(G.state);
    const result = await cloudPlugin.loadState();
    let merged = local;
    if (result && result.exists && result.payload) {
      let remote;
      try { remote = JSON.parse(result.payload); }
      catch (_) { throw new Error('The cloud backup could not be read. Your on-device data is safe.'); }
      merged = mergeState(local, remote);
    }
    merged.auth = profile;
    G.state = merged;
    ready = true;
    lastError = '';
    G.save();
    emitRestored();
  }
  async function syncNow() {
    if (!native || !ready || syncing || !G.isAuthed() || G.state.auth.provider !== 'google') return;
    syncing = true;
    try {
      const local = clone(G.state);
      const result = await cloudPlugin.loadState();
      let merged = local;
      if (result && result.exists && result.payload) {
        merged = mergeState(local, JSON.parse(result.payload));
      }
      merged.auth = G.state.auth;
      merged._savedAt = Date.now();
      // Suppress the normal save hook while merging and writing this snapshot.
      ready = false;
      G.state = merged;
      G.save();
      await cloudPlugin.saveState({ payload: JSON.stringify(merged) });
      ready = true;
      lastError = '';
    } catch (error) {
      ready = true;
      lastError = error && error.message ? error.message : 'Cloud backup is unavailable.';
    } finally {
      syncing = false;
    }
  }
  function queueSave(state) {
    if (!native || !ready || syncing || !state || !state.auth || state.auth.provider !== 'google') return;
    clearTimeout(timer);
    timer = setTimeout(syncNow, 1400);
  }
  async function initialize() {
    if (!native || !authPlugin || !cloudPlugin) return;
    try {
      const result = await authPlugin.getCurrentUser();
      const user = result && result.user;
      if (user) {
        await restore(user);
      } else if (G.state.auth && G.state.auth.provider === 'google' && !G.state.auth.uid) {
        G.clearAuth();
      }
    } catch (error) {
      ready = false;
      lastError = error && error.message ? error.message : 'Cloud backup will retry when online.';
    }
  }
  async function signIn() {
    if (!native || !authPlugin || !cloudPlugin) throw new Error('Google sign-in is available in the Android app.');
    if (!navigator.onLine) throw new Error('Connect to the internet to sign in. Reading remains available offline.');
    ready = false;
    const result = await authPlugin.signInWithGoogle();
    const profile = googleUser(result && result.user);
    G.setAuth(profile);
    try {
      await restore(result.user);
    } catch (error) {
      ready = false;
      throw new Error('You are signed in, but cloud backup could not load. Check your connection and try again.');
    }
    return profile;
  }
  async function signOut() {
    ready = false;
    clearTimeout(timer);
    if (native && authPlugin) await authPlugin.signOut();
    G.clearAuth();
    emitRestored();
  }
  async function deleteCloudState() {
    if (native && cloudPlugin && G.state.auth && G.state.auth.provider === 'google') {
      try { await cloudPlugin.deleteState(); } catch (_) { /* still erase the local copy */ }
    }
  }
  function status() {
    if (!native) return 'Google backup is available in the Android app.';
    if (!G.isAuthed() || G.state.auth.provider !== 'google') return 'Saved on this device. Sign in to back up.';
    return lastError ? 'Saved on this device. Cloud sync will retry when online.' : 'Google account · cloud backup enabled';
  }

  window.GitaCloud = { initialize, signIn, signOut, queueSave, deleteCloudState, status, isNative: native };
  window.addEventListener('online', () => {
    if (native && G.isAuthed() && G.state.auth.provider === 'google') initialize();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && native && G.isAuthed() && G.state.auth.provider === 'google') initialize();
  });
})();
