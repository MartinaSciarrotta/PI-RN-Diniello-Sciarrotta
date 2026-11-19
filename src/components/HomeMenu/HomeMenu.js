
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';

import NuevoPost from '../../screens/nuevoPost';
import Profile from '../../screens/profile';
import Home from '../../screens/home';
import Comments from '../../screens/comments';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePosts"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{ title: 'Comentarios' }}
      />
    </Stack.Navigator>
  );
}

export default function HomeMenu() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: () =>
            <FontAwesome
              name="home"
              size={24}
              color="#7c3aed"
            />
        }}
      />

      <Tab.Screen
        name="NuevoPost"
        component={NuevoPost}
        options={{
          tabBarIcon: () =>
            <FontAwesome
              name="plus-square"
              size={24}
              color="#7c3aed"
            />
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () =>
            <FontAwesome
              name="user"
              size={24}
              color="#7c3aed"
            />
        }}
      />
    </Tab.Navigator>
  );
}
