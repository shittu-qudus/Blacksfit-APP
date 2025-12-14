// App.tsx - Fixed Version (No expo-linking dependency)
import React, { useState, useEffect } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { store } from './comps/store';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from './lib/supabase';

// Import screens
import HomeScreen from './home';
import BlacksfitAboutProfessional from './screens/about';
import FavouritesScreen from './screens/favourites';
import Shop from './screens/shop';
import CartDisplay from './components/cartDisplay';
import { CustomTabBar } from './components/CustomTabBar';
import BlacksfitWelcome from './screens/welcome';
import LoginScreen from './auth/login';
import SignupScreen from './auth/signup';
import BlacksfitFAQ from './screens/FAQScreen';
import SettingsScreen from './screens/SettingsScreen';
import PaystackCheckout from './components/PaystackCheckout';
import CheckEmailScreen from './screens/CheckEmailScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Define TypeScript types for navigation
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  CheckEmail: undefined;
  ResetPassword: undefined;
  MainApp: undefined;
  Cart: undefined;
  PaystackCheckout: undefined;
  FAQ: undefined;
  Settings: undefined;
};

// Loading screen component
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

// Stack for Home tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Stack for Shop tab
function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopMain" component={Shop} />
    </Stack.Navigator>
  );
}

// Stack for Favourites tab
function FavouritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavouritesMain" component={FavouritesScreen} />
    </Stack.Navigator>
  );
}

// Stack for About tab
function AboutStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AboutMain" component={BlacksfitAboutProfessional} />
    </Stack.Navigator>
  );
}

// Cart Stack
function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartDisplay" 
        component={CartDisplay}
        options={{ 
          headerShown: false,
          title: "",
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
         
        }}
      />
      <Stack.Screen 
        name="PaystackCheckout" 
        component={PaystackCheckout}
        options={{ 
          title: 'Checkout',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

// Main Drawer Navigator (only accessible when authenticated)
function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        drawerPosition: 'left',
        drawerStyle: {
          width: 250,
          backgroundColor: '#0a0a0a',
        },
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: '#888',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        }
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={CustomTabBar}
        options={{
          drawerLabel: 'Home',
          title: 'Blacksfit',
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartStack}
        options={{
          drawerLabel: 'Shopping Cart',
          title: 'Shopping Cart',
        }}
      />
      <Drawer.Screen
        name="FAQ"
        component={BlacksfitFAQ}
        options={{
          drawerLabel: 'FAQ',
          title: 'FAQ',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
  );
}

// Main App Component
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth Event:', event);
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Deep linking configuration (works without expo-linking)
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['blacksfits://', 'https://blacksfit.com', 'http://localhost:19006'],
    config: {
      screens: {
        Welcome: 'welcome',
        Login: 'login',
        Signup: 'signup',
        CheckEmail: 'check-email',
        ResetPassword: 'reset-password',
        MainApp: 'main',
        Cart: 'cart',
        PaystackCheckout: 'checkout',
        FAQ: 'faq',
        Settings: 'settings',
      },
    },
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
        <Stack.Navigator 
          initialRouteName={session ? "MainApp" : "Welcome"}
          screenOptions={{ headerShown: false }}
        >
          {/* Authentication Screens */}
          <Stack.Screen name="Welcome" component={BlacksfitWelcome} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          
          {/* Main App (Protected) */}
          <Stack.Screen name="MainApp" component={MainDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}