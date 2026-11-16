import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import NuevoPost from '../../screens/nuevoPost'; 
import Profile from '../../screens/profile';

const Tab = createBottomTabNavigator();

export default function HomeMenu() {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
      <Tab.Screen
        name="NuevoPost"
        component={NuevoPost}
        options={{ tabBarIcon: () => <FontAwesome name="plus-square" size={24} color="#7c3aed" /> }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarIcon: () => <FontAwesome name="user" size={24} color="#7c3aed" /> }}
      />
    </Tab.Navigator>
  );
}