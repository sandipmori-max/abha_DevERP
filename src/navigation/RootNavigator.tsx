import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { View, ActivityIndicator, Text , StyleSheet, Image} from "react-native";

import IntroScreen from "../screens/Intro/IntroScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import OtpVerificationScreen from "../screens/Login/OtpVerificationScreen";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const proReduxData = useSelector(
    (state: any) => state.abha.activeUser
  );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300); // 300–500ms

    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={{
            uri: 'https://play-lh.googleusercontent.com/4o2xmTJIFLjpToZnWJZUYsCYcWGuJlH_SVGue1a6z39stjg-1Xl3KWxggo9p2pSMYE94Ol2HjeF4Z-83rLmPyA=w240-h480-rw'
          }} // apna logo
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>ABHA Health</Text>

        <Text style={styles.subtitle}>
          Your Digital Health Identity
        </Text>
      </View>

      <View style={styles.loaderSection}>
        <ActivityIndicator
          size="large"
          color="#0F6CBD"
        />

        <Text style={styles.loadingText}>
          Connecting securely...
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.powered}>
          Powered by
        </Text>

        <Text style={styles.abdm}>
          Ayushman Bharat Digital Mission
        </Text>
      </View>
    </View>
  );
}

  const isLoggedIn = !!proReduxData;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoggedIn ? (
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
        />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  topSection: {
    alignItems: "center",
    marginTop: 40,
  },

  logo: {
    width: 120,
    height: 120,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#003366",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 16,
  },

  loaderSection: {
    alignItems: "center",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#475569",
  },

  bottomSection: {
    alignItems: "center",
  },

  powered: {
    fontSize: 13,
    color: "#94A3B8",
  },

  abdm: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F6CBD",
  },
});

///https://play-lh.googleusercontent.com/4o2xmTJIFLjpToZnWJZUYsCYcWGuJlH_SVGue1a6z39stjg-1Xl3KWxggo9p2pSMYE94Ol2HjeF4Z-83rLmPyA=w240-h480-rw