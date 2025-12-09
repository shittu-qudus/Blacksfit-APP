// // src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { auth } from '../firebase';
// import firestore from '@react-native-firebase/firestore';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authError, setAuthError] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged((user) => {
//       setUser(user);
//       setLoading(false);
//       setAuthError(null);
//     });

//     return unsubscribe;
//   }, []);

//   // Save user data to Firestore
//   const saveUserToFirestore = async (user, additionalData = {}) => {
//     try {
//       await firestore()
//         .collection('users')
//         .doc(user.uid)
//         .set({
//           name: additionalData.name || '',
//           email: user.email,
//           createdAt: firestore.FieldValue.serverTimestamp(),
//           lastLogin: firestore.FieldValue.serverTimestamp(),
//           uid: user.uid,
//           ...additionalData
//         });
//     } catch (error) {
//       console.error('Error saving user to Firestore:', error);
//       throw error;
//     }
//   };

//   // Enhanced login function
//   const login = async (email, password) => {
//     try {
//       setAuthError(null);
//       const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
//       // Update last login timestamp
//       if (userCredential.user) {
//         await firestore()
//           .collection('users')
//           .doc(userCredential.user.uid)
//           .update({
//             lastLogin: firestore.FieldValue.serverTimestamp()
//           });
//       }
      
//       return { success: true, user: userCredential.user };
//     } catch (error) {
//       const errorMessage = getAuthErrorMessage(error.code);
//       setAuthError(errorMessage);
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Enhanced signup function
//   const signup = async (email, password, additionalData = {}) => {
//     try {
//       setAuthError(null);
//       const userCredential = await auth().createUserWithEmailAndPassword(email, password);
//       const user = userCredential.user;

//       // Save user data to Firestore
//       await saveUserToFirestore(user, additionalData);

//       return { success: true, user };
//     } catch (error) {
//       const errorMessage = getAuthErrorMessage(error.code);
//       setAuthError(errorMessage);
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Enhanced logout function
//   const logout = async () => {
//     try {
//       setAuthError(null);
//       await auth().signOut();
//       return { success: true };
//     } catch (error) {
//       const errorMessage = 'Failed to logout. Please try again.';
//       setAuthError(errorMessage);
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Password reset function
//   const resetPassword = async (email) => {
//     try {
//       setAuthError(null);
//       await auth().sendPasswordResetEmail(email);
//       return { success: true };
//     } catch (error) {
//       const errorMessage = getAuthErrorMessage(error.code);
//       setAuthError(errorMessage);
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Update user profile
//   const updateProfile = async (updates) => {
//     try {
//       setAuthError(null);
//       await auth().currentUser.updateProfile(updates);
      
//       // Also update in Firestore if name is provided
//       if (updates.displayName && user) {
//         await firestore()
//           .collection('users')
//           .doc(user.uid)
//           .update({
//             name: updates.displayName,
//             updatedAt: firestore.FieldValue.serverTimestamp()
//           });
//       }
      
//       // Update local user state
//       setUser({ ...user, ...updates });
//       return { success: true };
//     } catch (error) {
//       const errorMessage = getAuthErrorMessage(error.code);
//       setAuthError(errorMessage);
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Get user data from Firestore
//   const getUserData = async () => {
//     try {
//       if (user) {
//         const userDoc = await firestore()
//           .collection('users')
//           .doc(user.uid)
//           .get();
//         return userDoc.exists ? userDoc.data() : null;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting user data:', error);
//       return null;
//     }
//   };

//   // Get user token
//   const getIdToken = async () => {
//     try {
//       if (user) {
//         return await user.getIdToken();
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting user token:', error);
//       return null;
//     }
//   };

//   // Clear errors manually
//   const clearError = () => {
//     setAuthError(null);
//   };

//   // Helper function for auth error messages
//   const getAuthErrorMessage = (errorCode) => {
//     switch (errorCode) {
//       case 'auth/invalid-email':
//         return 'Invalid email address format.';
//       case 'auth/user-disabled':
//         return 'This account has been disabled.';
//       case 'auth/user-not-found':
//         return 'No account found with this email.';
//       case 'auth/wrong-password':
//         return 'Incorrect password. Please try again.';
//       case 'auth/email-already-in-use':
//         return 'An account with this email already exists.';
//       case 'auth/weak-password':
//         return 'Password should be at least 6 characters.';
//       case 'auth/too-many-requests':
//         return 'Too many attempts. Please try again later.';
//       case 'auth/network-request-failed':
//         return 'Network error. Please check your connection.';
//       case 'auth/requires-recent-login':
//         return 'Please log in again to perform this action.';
//       case 'auth/operation-not-allowed':
//         return 'Email/password accounts are not enabled.';
//       default:
//         return 'An unexpected error occurred. Please try again.';
//     }
//   };

//   const value = {
//     // State
//     user,
//     loading,
//     authError,
    
//     // Auth status helpers
//     isAuthenticated: !!user,
//     isEmailVerified: user?.emailVerified || false,
    
//     // Actions
//     login,
//     signup,
//     logout,
//     resetPassword,
//     updateProfile,
//     getUserData,
//     getIdToken,
//     clearError,
    
//     // User info shortcuts
//     userId: user?.uid,
//     userEmail: user?.email,
//     displayName: user?.displayName,
//     photoURL: user?.photoURL,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };