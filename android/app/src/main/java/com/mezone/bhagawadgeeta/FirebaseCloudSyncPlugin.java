package com.mezone.bhagawadgeeta;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;
import com.google.firebase.firestore.Source;
import com.google.firebase.firestore.FieldValue;

import java.util.HashMap;
import java.util.Map;

@CapacitorPlugin(name = "FirebaseCloudSync")
public class FirebaseCloudSyncPlugin extends Plugin {
    private DocumentReference stateDocument() {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user == null) return null;
        return FirebaseFirestore.getInstance()
            .collection("users")
            .document(user.getUid())
            .collection("private")
            .document("appState");
    }

    @PluginMethod
    public void loadState(PluginCall call) {
        DocumentReference doc = stateDocument();
        if (doc == null) {
            call.reject("Sign in with Google before loading cloud data.");
            return;
        }
        doc.get(Source.SERVER)
            .addOnSuccessListener(snapshot -> {
                JSObject result = new JSObject();
                result.put("exists", snapshot.exists());
                result.put("payload", snapshot.exists() ? snapshot.getString("payload") : null);
                call.resolve(result);
            })
            .addOnFailureListener(error -> call.reject("Could not load your cloud backup.", error));
    }

    @PluginMethod
    public void saveState(PluginCall call) {
        DocumentReference doc = stateDocument();
        if (doc == null) {
            call.reject("Sign in with Google before saving cloud data.");
            return;
        }
        String payload = call.getString("payload");
        if (payload == null || payload.length() > 900_000) {
            call.reject("Your saved data is missing or too large to back up.");
            return;
        }
        Map<String, Object> values = new HashMap<>();
        values.put("payload", payload);
        values.put("updatedAt", FieldValue.serverTimestamp());
        doc.set(values, SetOptions.merge())
            .addOnSuccessListener(unused -> call.resolve())
            .addOnFailureListener(error -> call.reject("Could not save your cloud backup.", error));
    }

    @PluginMethod
    public void deleteState(PluginCall call) {
        DocumentReference doc = stateDocument();
        if (doc == null) {
            call.reject("Sign in with Google before deleting cloud data.");
            return;
        }
        doc.delete()
            .addOnSuccessListener(unused -> call.resolve())
            .addOnFailureListener(error -> call.reject("Could not delete your cloud backup.", error));
    }
}
