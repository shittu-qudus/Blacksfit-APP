// // firebase.js
// import { initializeApp, getApp, getApps } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // Your Firebase configuration - using web config for both platforms
// const firebaseConfig = {
//   apiKey: "AIzaSyAo8j6HfPfHkqVDbKGgQpUw3KCR9wR3ZjQ",
//   authDomain: "blacksfit-d7ea8.firebaseapp.com",
//   projectId: "blacksfit-d7ea8",
//   storageBucket: "blacksfit-d7ea8.firebasestorage.app",
//   messagingSenderId: "577951014381",
//   appId: "1:577951014381:web:b50dc96ac616a0f2959be4" // Use web app ID or your preferred app ID
// };

// // Initialize Firebase with error handling
// let app;
// try {
//   // Check if Firebase is already initialized to avoid duplicates
//   if (getApps().length === 0) {
//     app = initializeApp(firebaseConfig);
//     console.log('✅ Firebase initialized successfully');
//   } else {
//     app = getApp();
//     console.log('✅ Using existing Firebase app');
//   }
// } catch (error) {
//   console.error('❌ Firebase initialization error:', error);
//   // Fallback to existing app or reinitialize
//   app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
// }

// // Initialize Auth with AsyncStorage persistence and error handling
// let auth;
// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });
//   console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
// } catch (error) {
//   console.error('❌ Firebase Auth initialization error:', error);
//   // Fallback to default auth initialization
//   auth = initializeAuth(app);
// }

// // Initialize Firestore with error handling
// let db;
// try {
//   db = getFirestore(app);
//   console.log('✅ Firestore initialized successfully');
// } catch (error) {
//   console.error('❌ Firestore initialization error:', error);
// }

// // Optional: Add Firebase Storage if needed
// // import { getStorage } from 'firebase/storage';
// // export const storage = getStorage(app);

// export { app, auth, db };
// export default app;