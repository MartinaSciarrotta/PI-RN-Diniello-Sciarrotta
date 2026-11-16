import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import Profile from '../../screens/profile';

const Tab = createBottomTabNavigator();

export default function HomeMenu() {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarIcon: () => <FontAwesome name="user" size={24} color="#7c3aed" /> }}
      />
    </Tab.Navigator>
  );
}