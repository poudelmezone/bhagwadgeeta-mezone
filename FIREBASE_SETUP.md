# Set up Google sign-in and cloud backup

The app currently stores reading data on the phone. Google sign-in and cross-device
backup need a Firebase project owned by you. Do not share a Google password, service
account key, or private signing key.

## Firebase Console setup

1. Sign in at <https://console.firebase.google.com/> and create a Firebase project.
2. Add an Android app with package name `com.mezone.bhagawadgeeta`.
3. Add this SHA-1 fingerprint for the current sideload/debug APK:

   `1A:1D:73:90:D3:89:6B:A4:6F:F4:66:74:53:CD:67:36:15:E5:6C:2C`

   A future Play Store/release signing key has its own SHA-1 and must be added too.
4. In Authentication → Sign-in method, enable Google.
5. Create a Cloud Firestore database. Set its rules to restrict each user to their
   own data:

   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

6. In Project settings → General, add the SHA-1 fingerprint above to the Android app.
7. Download a fresh Android `google-services.json` after enabling Google sign-in and adding SHA-1.

## Send back to finish integration

The Android `google-services.json` is included in the native app. Google sign-in and
cloud backup need internet; the bundled Gita and the device's local copy of reading
progress remain available offline. The app stores each account's backup under
`users/{uid}/private/appState`, protected by the UID-scoped Firestore rules above.
