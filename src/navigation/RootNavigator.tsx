import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DetailsScreen from '../screens/DetailsScreen';
import IntroScreen from '../screens/Intro/IntroScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import OtpVerificationScreen from '../screens/Login/OtpVerificationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
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
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile Screen',
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerificationScreen}
        options={{
          title: 'Otp Verification',
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