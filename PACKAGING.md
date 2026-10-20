# Packaging the Gita app for Android and iOS

The app is a fully offline Progressive Web App (PWA). There are three ways to ship it
as a real store-installable app, from easiest to most native.

## Android — offline APK

The Capacitor Android app packages the web app, icons and Gita data inside the APK. It
does not need a website or an internet connection to open or read the content.

Install Node.js, JDK 21 and Android SDK Platform 36 plus Build Tools 36.0.0, then run:

```bash
npm install
npm run android:build
```

The debug APK is written to
`android/app/build/outputs/apk/debug/app-debug.apk`. Copy it to your phone and install
it (Android may ask you to allow installs from that file app). This debug APK is for
sideloading. For Play Store distribution, build and sign a release bundle in Android
Studio.

`npm run android:prepare` stages only the app shell and runtime assets into `www/`;
`npm run android:sync` copies them into the native project. The generated `www/`
folder is ignored by Git.

## Hosted PWA / iOS prerequisite

The hosted PWA and the iOS Capacitor setup below use a real HTTPS URL. Deploy this
folder to any static host first (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or
your own server). The Android offline APK above does not use that host.

The PWA already works as an installable app today:
open it in Chrome/Edge → menu → **Install app**, or Safari on iOS → Share →
**Add to Home Screen**. That is the zero-build path.

---

## Option A — Android (TWA / Trusted Web Activity) → signed AAB/APK

This wraps the hosted PWA in a real Android app shell using Bubblewrap.

```bash
# one-time: install the CLI
npm i -g @bubblewrap/cli

# point at the manifest on your host, then answer the prompts
npx @bubblewrap/cli init --manifest https://YOUR-DEPLOYED-HOST/manifest.webmanifest

# build a signed Android App Bundle (for Play Store) and an APK (for sideload)
npx @bubblewrap/cli build
```

Outputs:
- `app-release-bundle.aab` → upload to Google Play
- `app-release-signed.apk` → sideload / distribute directly

The committed `bubblewrap.json` is a pre-filled starting config
(`packageId: com.mezone.bhagawadgeeta`). After `init` regenerates it with your host,
adjust `host` / `*Url` fields to your domain and re-run `build`.

**Digital Asset Links:** to hide the browser address bar, host
`/.well-known/assetlinks.json` with your app's signing-certificate fingerprint.
Bubblewrap prints the exact JSON during `init`.

---

## Option B — iOS (Capacitor) → IPA via Xcode

This wraps the hosted PWA in a native WKWebView and produces an Xcode project you
build into an IPA.

```bash
npm i @capacitor/core @capacitor/cli @capacitor/ios

# init (edit capacitor.config.json so server.url points at YOUR-DEPLOYED-HOST)
npx @capacitor/cli init "Gita" com.mezone.bhagawadgeeta --web-dir .

npx @capacitor/cli add ios
npx @capacitor/cli sync ios

# open in Xcode and archive
npx cap open ios
```

In Xcode: set your team/bundle id, then **Product → Archive → Distribute App** to
produce the IPA for App Store Connect / TestFlight.

The iOS app icon set is already generated at
`ios/App/App/Assets.xcassets/AppIcon.appiconset/`.

**Standalone/offline note:** with Capacitor the app is served from your host inside a
native shell, so it still needs a first load. To make iOS fully offline, point
`server.url` at your host and rely on the service worker cache (already built in) —
after the first visit the shell and data load from cache.

---

## Option C — no native build (installable PWA)

Just host the folder. Chrome/Edge/Safari will offer **Add to Home Screen / Install**.
The service worker (`sw.js`) caches the shell, icons and data so it opens offline.

---

## Files added for packaging

- `icons/` — generated PNG icons (192, 512, 512-maskable, apple-touch, 120/152/167/180/1024)
- `scripts/gen-icons.mjs` — zero-dependency icon generator (`npm run icons`)
- `manifest.webmanifest` — PWA manifest pointing at the PNG icons
- `bubblewrap.json` — Android TWA starting config
- `capacitor.config.json` — Capacitor config for iOS/Android
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` — iOS app icons
- `package.json` — build/serve/icon scripts
