// App.js - Fixed Navigation Structure
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { store } from './comps/store';
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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

// MAIN CART STACK - This is the key fix!
function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartDisplay" 
        component={CartDisplay}
        options={{ title: 'Shopping Cart' }}
      />
      <Stack.Screen 
        name="PaystackCheckout" 
        component={PaystackCheckout}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}

// Drawer Navigator
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
          backgroundColor: '#9a9191ff',
        },
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
        component={CartStack} // This now includes both CartDisplay AND PaystackCheckout
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

// Main App Navigator
function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={BlacksfitWelcome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}