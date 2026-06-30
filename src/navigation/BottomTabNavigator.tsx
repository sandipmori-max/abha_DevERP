import React from "react";
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import ProfileScreen from "../screens/Profile/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";

const BottomTabNavigator = () => {
    const renderIcon = (routeName: string, selectedTab: string) => {
        let icon = "";

        switch (routeName) {
            case "Profile":
                icon = "person";
                break;

            case "Details":
                icon = "settings";
                break;
        }

        return (
            <MaterialIcons
                name={icon}
                size={28}
                color={
                    selectedTab === routeName
                        ? "#D96A27"
                        : "#94A3B8"
                }
            />
        );
    };

    return (
        <CurvedBottomBar.Navigator
            type="DOWN"
            height={60}
            circleWidth={60}
            bgColor="#ccc"
            initialRouteName="Profile"
            borderTopLeftRight
            screenOptions={{
                headerShown: false,
            }}
            renderCircle={() => (
                <Animated.View style={styles.circle}>
                    <TouchableOpacity style={styles.fab}>
                        <MaterialIcons
                            name="qr-code-scanner"
                            size={28}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </Animated.View>
            )}

            tabBar={({ routeName, selectedTab, navigate }) => (
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigate(routeName)}
                >
                    {renderIcon(routeName, selectedTab)}
                </TouchableOpacity>
            )}
        >
            <CurvedBottomBar.Screen
                name="Profile"
                position="LEFT"
                component={ProfileScreen}
            />

            <CurvedBottomBar.Screen
                name="Details"
                position="RIGHT"
                component={DetailsScreen}
            />
        </CurvedBottomBar.Navigator>
    );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    circle: {
        width: 65,
        height: 65,
        borderRadius: 33,
        justifyContent: "center",
        alignItems: "center",
        bottom: 30,
    },

    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#D96A27",
        justifyContent: "center",
        alignItems: "center",
     },
});