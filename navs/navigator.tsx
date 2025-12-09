// // App.js
// import React from 'react';
// import { TouchableOpacity } from 'react-native';
// import { NavigationContainer, DrawerActions } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { FontAwesome } from '@expo/vector-icons';
// import { View, Text, ActivityIndicator } from 'react-native';
// // Import your existing screens
// import HomeScreen from '../home';
// import BlacksfitAboutProfessional from '../screens/about';
// import FavouritesScreen from '../screens/favourites';
// import Shop from '../screens/shop';
// import CartDisplay from '../components/cartDisplay';
// import SettingsScreen from '../screens/SettingsScreen';
// import BlacksfitFAQ from '../screens/FAQScreen';
// import BlacksfitWelcome from '../screens/welcome';

// // Import new authentication screens and context
// import LoginScreen from '../auth/login';
// import SignupScreen from '../auth/signup';
// import DashboardScreen from '../screens/DashboardScreen';
// import { AuthProvider, useAuth } from '../context/AuthContext';

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

// /* -------------------- AUTH STACK -------------------- */

// function AuthStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Signup" component={SignupScreen} />
//     </Stack.Navigator>
//   );
// }

// /* -------------------- TAB NAVIGATOR -------------------- */

// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#2b8ef3',
//         tabBarInactiveTintColor: '#666',
//         tabBarStyle: {
//           backgroundColor: '#000',
//           height: 60,
//           borderTopWidth: 1,
//           borderTopColor: '#333',
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '600',
//           marginBottom: 5,
//         },
//         headerShown: true,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Shop"
//         component={Shop}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="shopping-bag" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Favourites"
//         component={FavouritesScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="heart" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="About"
//         component={BlacksfitAboutProfessional}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="info-circle" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// /* -------------------- MAIN STACK (Authenticated) -------------------- */

// function MainStack({ navigation }: any) {
//   const { user, logout } = useAuth();

//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: '#000' },
//         headerTintColor: '#fff',
//         headerTitleStyle: { fontWeight: 'bold' },
//         headerLeft: () => (
//           <TouchableOpacity
//             style={{ marginLeft: 15 }}
//             onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//           >
//             <FontAwesome name="bars" size={24} color="#fff" />
//           </TouchableOpacity>
//         ),
//       }}
//     >
//       <Stack.Screen
//         name="Welcome"
//         component={BlacksfitWelcome}
//         options={{ 
//           title: 'Welcome to Blacksfit',
//           headerShown: false
//         }}
//       />
//       <Stack.Screen
//         name="MainTabs"
//         component={TabNavigator}
//         options={{ 
//           title: 'Blacksfit',
//           headerLeft: () => (
//             <TouchableOpacity
//               style={{ marginLeft: 15 }}
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//             >
//               <FontAwesome name="bars" size={24} color="#fff" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Stack.Screen
//         name="Cart"
//         component={CartDisplay}
//         options={{ title: 'Shopping Cart' }}
//       />
//       <Stack.Screen
//         name="Profile"
//         component={DashboardScreen}
//         options={{ title: 'My Profile' }}
//       />
//     </Stack.Navigator>
//   );
// }

// /* -------------------- DRAWER NAVIGATOR -------------------- */

// function DrawerNavigator() {
//   const { user, logout } = useAuth();

//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: { backgroundColor: '#fff', width: 280 },
//         drawerActiveTintColor: '#2b8ef3',
//         drawerInactiveTintColor: '#666',
//         drawerLabelStyle: { fontSize: 16, fontWeight: '600' },
//       }}
//     >
//       <Drawer.Screen
//         name="HomeDrawer"
//         component={MainStack}
//         options={{
//           title: 'Home',
//           drawerIcon: ({ color, size }) => (
//             <FontAwesome name="home" size={size} color={color} />
//           ),
//         }}
//       />
      
//       {user ? (
//         // Show these screens only when user is logged in
//         <>
//           <Drawer.Screen
//             name="Profile"
//             component={DashboardScreen}
//             options={{
//               title: 'My Profile',
//               drawerIcon: ({ color, size }) => (
//                 <FontAwesome name="user" size={size} color={color} />
//               ),
//             }}
//           />
//           <Drawer.Screen
//             name="Favourites"
//             component={FavouritesScreen}
//             options={{
//               drawerIcon: ({ color, size }) => (
//                 <FontAwesome name="heart" size={size} color={color} />
//               ),
//             }}
//           />
//         </>
//       ) : (
//         // Show login/signup when user is not logged in
//         <Drawer.Screen
//           name="Login"
//           component={AuthStack}
//           options={{
//             title: 'Login / Sign Up',
//             drawerIcon: ({ color, size }) => (
//               <FontAwesome name="sign-in" size={size} color={color} />
//             ),
//           }}
//         />
//       )}

//       <Drawer.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           drawerIcon: ({ color, size }) => (
//             <FontAwesome name="cog" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="FAQ"
//         component={BlacksfitFAQ}
//         options={{
//           drawerIcon: ({ color, size }) => (
//             <FontAwesome name="question-circle" size={size} color={color} />
//           ),
//         }}
//       />

//       {user && (
//         // Logout button in drawer
//         <Drawer.Screen
//           name="Logout"
//           component={LogoutButton}
//           options={{
//             title: 'Logout',
//             drawerIcon: ({ color, size }) => (
//               <FontAwesome name="sign-out" size={size} color={color} />
//             ),
//           }}
//         />
//       )}
//     </Drawer.Navigator>
//   );
// }

// // Logout button component for drawer
// function LogoutButton() {
//   const { logout } = useAuth();
//   React.useEffect(() => {
//     logout();
//   }, []);
  
//   return null;
// }

// /* -------------------- ROOT NAVIGATOR -------------------- */

// function RootNavigator() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <SplashScreen />
//     );
//   }

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {user ? (
//         // User is signed in
//         <Stack.Screen name="MainApp" component={DrawerNavigator} />
//       ) : (
//         // User is not signed in
//         <Stack.Screen name="Auth" component={AuthStack} />
//       )}
//     </Stack.Navigator>
//   );
// }

// /* -------------------- SPLASH SCREEN -------------------- */

// function SplashScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
//       <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Blacksfit</Text>
//       <ActivityIndicator size="large" color="#2b8ef3" style={{ marginTop: 20 }} />
//     </View>
//   );
// }

// /* -------------------- MAIN APP -------------------- */

// export default function App() {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <RootNavigator />
//       </NavigationContainer>
//     </AuthProvider>
//   );
// }