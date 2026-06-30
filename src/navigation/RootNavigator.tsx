import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import IntroScreen from "../screens/Intro/IntroScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import OtpVerificationScreen from "../screens/Login/OtpVerificationScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const proReduxData = useSelector(
    (state: any) => state.abha.activeUser
  );

  const isLoggedIn = !!proReduxData;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={IntroScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="OtpVerification"
            component={OtpVerificationScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;