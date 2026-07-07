import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { persistor, store } from "../redux/store";

const menuItems = [
    {
        title: "Home",
        icon: "home-filled",
        screen: "Home",
    },
    {
        title: "Profile",
        icon: "person",
        screen: "Profile",
    },
    {
        title: "Details",
        icon: "description",
        screen: "Details",
    },
     {
        title: "Notification",
        icon: "notifications",
        screen: "Notification",
    },
    {
        title: "Settings",
        icon: "settings",
        screen: "Settings",
    },
];

const CustomDrawer = (
    props: DrawerContentComponentProps
) => {
    const { navigation, state } = props;

    const user = useSelector(
        (state: any) => state.abha.activeUser
    );

    const activeRoute =
        state.routeNames[state.index];

    return (
        <View style={styles.container}>
            <DrawerContentScrollView
                {...props}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >

                <>

                    <View style={styles.profileContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                                </Text>
                            </View>
                            <View style={{marginLeft: 8}}> 
                                <Text numberOfLines={1} style={styles.fullName}>
                                    {user?.fullname}
                                </Text>

                                <View style={styles.roleBadge}>
                                    <MaterialIcons
                                        name="verified-user"
                                        size={15}
                                        color="#2563EB"
                                    />
                                    <Text style={styles.roleText}>
                                        {user?.rolename}
                                    </Text>
                                </View>
                            </View>
                        </View>




                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="email"
                                size={16}
                                color="#64748B"
                            />
                            <Text
                                numberOfLines={1}
                                style={styles.infoText}
                            >
                                {user?.emailid}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="call"
                                size={16}
                                color="#64748B"
                            />
                            <Text style={styles.infoText}>
                                +91 {user?.mobileno}
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {menuItems.map(item => {
                            const active =
                                activeRoute === item.screen;

                            return (
                                <TouchableOpacity
                                    key={item.screen}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.menuItem,
                                        active &&
                                        styles.activeMenu,
                                    ]}
                                    onPress={() =>
                                        navigation.navigate(
                                            item.screen as never
                                        )
                                    }
                                >
                                    <MaterialIcons
                                        name={item.icon as any}
                                        size={20}
                                        color={
                                            active
                                                ? "#251d50"
                                                : "#64748B"
                                        }
                                    />

                                    <Text
                                        style={[
                                            styles.menuText,
                                            active &&
                                            styles.activeText,
                                        ]}
                                    >
                                        {item.title}
                                    </Text>

                                    <MaterialIcons
                                        name="chevron-right"
                                        size={16}
                                        color="#94A3B8"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </>

            </DrawerContentScrollView>

            {/* ================= FOOTER ================= */}

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.logout}
                    activeOpacity={0.8}
                    onPress={async () => {
                        store.dispatch({ type: "RESET_APP" });
                        await persistor.purge();
                        await persistor.flush();
                    }}
                >
                    <MaterialIcons
                        name="logout"
                        size={14}
                        color="#251d50"
                    />

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>

                <Text style={styles.version}>
                    Version 1.0.0
                </Text>
            </View>
        </View>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },

    name: {
        marginTop: 15,
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
    },

    address: {
        marginTop: 6,
        color: "#E5EDFF",
        fontSize: 14,
    },

    badge: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#16A34A",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
    },

    badgeText: {
        color: "#FFF",
        marginLeft: 6,
        fontWeight: "600",
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 14,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },

    activeMenu: {
        backgroundColor: "#fff7f3",
    },

    menuText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: "#1F2937",
    },

    activeText: {
        color: "#251d50",
        fontWeight: "600",
    },

    footer: {
        borderTopWidth: 1,
        borderColor: "#F1F5F9",
        padding: 20,
    },

    logout: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEF2F2",
        paddingVertical: 8,
        borderRadius: 4,
    },

    logoutText: {
        marginLeft: 10,
        color: "#251d50",
    },

    version: {
        textAlign: "center",
        marginTop: 16,
        color: "#94A3B8",
        fontSize: 12,
    },

    profileContainer: {
        marginHorizontal: 6,
        marginTop: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    avatar: {
        width: 72,
        height: 72,
        borderRadius: 12,
        backgroundColor: "#251D50",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },

    avatarText: {
        color: "#FFF",
        fontSize: 30,
        fontWeight: "700",
    },

    fullName: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: "700",
        color: "#0F172A",
    },

    roleBadge: {
        marginTop: 10,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E0F2FE",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 2,
    },

    roleText: {
        marginLeft: 6,
        fontSize: 13, 
        color: "#2563EB",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
    },

    infoText: {
        marginLeft: 10,
        flex: 1,
        color: "#475569",
        fontSize: 14,
    },
});