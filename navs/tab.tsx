import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens
import HomeScreen from '../home';
import BlacksfitAbout from '../screens/about';
import FavouritesScreen from '../screens/favourites';
import Shop from '../screens/shop';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { backgroundColor: '#fff', height: 60 },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Shop" component={Shop} />
        <Tab.Screen name="Favourites" component={FavouritesScreen} />
        <Tab.Screen name="About" component={BlacksfitAbout} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
