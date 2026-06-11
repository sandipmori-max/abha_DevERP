import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home Screen',
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