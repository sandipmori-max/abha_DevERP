import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomTabNavigator from "./BottomTabNavigator";
import CustomDrawer from "./CustomDrawer";

import ProfileScreen from "../screens/Profile/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEdgeWidth: 80,
        overlayColor: "rgba(0,0,0,0.45)",
        sceneStyle: {
          backgroundColor: "#F5F7FB",
        },
        drawerStyle: {
          width: "72%",
          backgroundColor: "#FFFFFF",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 35,
          overflow: "hidden",
        },
        drawerActiveTintColor: "#2563EB",
        drawerInactiveTintColor: "#64748B",
        swipeEnabled: false,
        drawerHideStatusBarOnOpen: false,
        drawerStatusBarAnimation: "fade",
      }}
    >
      {/* HOME */}
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
      />

      {/* PROFILE */}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
      />

      {/* DETAILS */}
      <Drawer.Screen
        name="Details"
        component={DetailsScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;