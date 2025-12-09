// components/CustomTabBar.js
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../home';
import Shop from '../screens/shop';
import FavoritesScreen from '../screens/favourites';
import BlacksfitAboutProfessional from '../screens/about';


const Tab = createBottomTabNavigator();

// Custom Tab Bar Icon with Badge
const TabBarIcon = ({ name, color, size, focused, badgeCount }) => {
  return (
    <View style={{ position: 'relative' }}>
      <FontAwesome name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: '#ef4444',
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

// Custom Tab Bar Component
export const CustomTabBar = () => {
  const favorites = useSelector((state) => state.favorites?.items || []);
  const cartItems = useSelector((state) => state.cart?.items || []);

  const totalFavorites = favorites.length;
  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2b8ef3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { 
          backgroundColor: '#000', 
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#333',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name="home" 
              color={color} 
              size={size} 
              focused={focused}
              badgeCount={0}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={Shop}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name="shopping-bag" 
              color={color} 
              size={size} 
              focused={focused}
              badgeCount={0}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Favourites" 
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name="heart" 
              color={color} 
              size={size} 
              focused={focused}
              badgeCount={totalFavorites}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="About" 
        component={BlacksfitAboutProfessional}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name="info-circle" 
              color={color} 
              size={size} 
              focused={focused}
              badgeCount={0}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};