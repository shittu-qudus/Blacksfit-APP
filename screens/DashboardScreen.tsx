// // src/screens/DashboardScreen.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   ScrollView
// } from 'react-native';
// import { useAuth } from '../context/AuthContext';
// import firestore from '@react-native-firebase/firestore';
// import { FontAwesome } from '@expo/vector-icons';

// // Define TypeScript interfaces
// interface UserData {
//   name?: string;
//   email?: string;
//   createdAt?: any; // Using any for Firestore timestamp flexibility
//   lastLogin?: any; // Using any for Firestore timestamp flexibility
//   uid?: string;
// }

// interface DashboardScreenProps {
//   navigation: any;
// }

// const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
//   const { user, logout, getUserData } = useAuth();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         try {
//           // Method 1: Using the getUserData from AuthContext
//           const data = await getUserData();
//           if (data) {
//             setUserData(data as UserData);
//           } else {
//             // Method 2: Direct Firestore call as fallback - using React Native Firebase syntax
//             const userDoc = await firestore()
//               .collection('users')
//               .doc(user.uid)
//               .get();
            
//             // React Native Firebase uses .exists property (not function)
//             if (userDoc.exists) {
//               setUserData(userDoc.data() as UserData);
//             } else {
//               setUserData({
//                 name: user.displayName || '',
//                 email: user.email || '',
//                 uid: user.uid
//               });
//             }
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           Alert.alert('Error', 'Failed to load user data');
//           // Set fallback user data
//           setUserData({
//             name: user.displayName || '',
//             email: user.email || '',
//             uid: user.uid
//           });
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [user, getUserData]);

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Logout', 
//           onPress: async () => {
//             const result = await logout();
//             if (!result.success) {
//               Alert.alert('Error', result.error);
//             }
//           },
//           style: 'destructive'
//         }
//       ]
//     );
//   };

//   const navigateToFavourites = () => {
//     navigation.navigate('Favourites');
//   };

//   const navigateToSettings = () => {
//     navigation.navigate('Settings');
//   };

//   const navigateToEditProfile = () => {
//     navigation.navigate('EditProfile');
//   };

//   const formatDate = (timestamp: any): string => {
//     if (!timestamp) return 'N/A';
    
//     try {
//       // Handle Firestore Timestamp (React Native Firebase)
//       // React Native Firebase timestamp has toDate() method
//       if (timestamp && typeof timestamp.toDate === 'function') {
//         const date = timestamp.toDate();
//         return date.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//       }
      
//       // Handle Date object
//       if (timestamp instanceof Date) {
//         return timestamp.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//       }
      
//       // Handle timestamp in seconds (Firestore format from web SDK)
//       if (timestamp.seconds && typeof timestamp.seconds === 'number') {
//         const date = new Date(timestamp.seconds * 1000);
//         return date.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//       }
      
//       // Handle plain number timestamp (milliseconds)
//       if (typeof timestamp === 'number') {
//         const date = new Date(timestamp);
//         return date.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//       }
      
//       return 'N/A';
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'N/A';
//     }
//   };

//   const getInitials = (name?: string): string => {
//     if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
//     return name
//       .split(' ')
//       .map(word => word.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color="#2b8ef3" />
//         <Text style={styles.loadingText}>Loading your profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Text style={styles.title}>My Profile</Text>
//         <Text style={styles.welcome}>Welcome back! 👋</Text>
//       </View>
      
//       {/* User Info Card */}
//       <View style={styles.userInfoCard}>
//         <View style={styles.avatarSection}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {getInitials(userData?.name)}
//             </Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={navigateToEditProfile}
//           >
//             <FontAwesome name="pencil" size={14} color="#2b8ef3" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.infoGrid}>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Full Name</Text>
//             <Text style={styles.infoValue}>
//               {userData?.name || user?.displayName || 'Not set'}
//             </Text>
//           </View>

//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Email Address</Text>
//             <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
//           </View>

//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>User ID</Text>
//             <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
//               {user?.uid ? `${user.uid.slice(0, 8)}...` : 'N/A'}
//             </Text>
//           </View>

//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Member Since</Text>
//             <Text style={styles.infoValue}>
//               {formatDate(userData?.createdAt)}
//             </Text>
//           </View>

//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Last Login</Text>
//             <Text style={styles.infoValue}>
//               {formatDate(userData?.lastLogin)}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Quick Actions Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Quick Actions</Text>
        
//         <View style={styles.actionsGrid}>
//           <TouchableOpacity 
//             style={[styles.actionCard, styles.favouritesCard]} 
//             onPress={navigateToFavourites}
//           >
//             <View style={styles.actionIcon}>
//               <FontAwesome name="heart" size={24} color="#FF6B6B" />
//             </View>
//             <Text style={styles.actionTitle}>Favourites</Text>
//             <Text style={styles.actionSubtitle}>Your saved items</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionCard, styles.settingsCard]} 
//             onPress={navigateToSettings}
//           >
//             <View style={styles.actionIcon}>
//               <FontAwesome name="cog" size={24} color="#4ECDC4" />
//             </View>
//             <Text style={styles.actionTitle}>Settings</Text>
//             <Text style={styles.actionSubtitle}>App preferences</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Stats Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Your Stats</Text>
//         <View style={styles.statsGrid}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>0</Text>
//             <Text style={styles.statLabel}>Favourites</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>0</Text>
//             <Text style={styles.statLabel}>Activities</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>1</Text>
//             <Text style={styles.statLabel}>Devices</Text>
//           </View>
//         </View>
//       </View>

//       {/* Logout Button */}
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <FontAwesome name="sign-out" size={20} color="#fff" />
//         <Text style={styles.logoutButtonText}>Sign Out</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   header: {
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   welcome: {
//     fontSize: 18,
//     color: '#666',
//     fontWeight: '500',
//   },
//   userInfoCard: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     margin: 20,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   avatarSection: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#2b8ef3',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 4,
//     borderColor: '#e8f4ff',
//   },
//   avatarText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   editButton: {
//     position: 'absolute',
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'white',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#2b8ef3',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   infoGrid: {
//     gap: 16,
//   },
//   infoItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#1a1a1a',
//     fontWeight: '600',
//   },
//   section: {
//     marginHorizontal: 20,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 16,
//   },
//   actionsGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionCard: {
//     flex: 1,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   favouritesCard: {
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF6B6B',
//   },
//   settingsCard: {
//     borderLeftWidth: 4,
//     borderLeftColor: '#4ECDC4',
//   },
//   actionIcon: {
//     marginBottom: 12,
//   },
//   actionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   actionSubtitle: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2b8ef3',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   logoutButton: {
//     backgroundColor: '#FF3B30',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 18,
//     borderRadius: 16,
//     margin: 20,
//     marginTop: 10,
//     marginBottom: 40,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 12,
//   },
// });

// export default DashboardScreen;