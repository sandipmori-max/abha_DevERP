import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import IntroScreen from '../screens/Intro/IntroScreen';
import LoginScreen from '../screens/Login/LoginScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown:false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={IntroScreen}
        options={{
          title: 'Home Screen',
        }}
      />
  <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login Screen',
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Details Screen',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;