import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import MaterialIcons from "@react-native-vector-icons/material-icons";

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
                  size={24}
                  color={
                    active
                      ? "#D96A27"
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
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </DrawerContentScrollView>

      {/* ================= FOOTER ================= */}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logout}
          activeOpacity={0.8}
          onPress={() => {
            // TODO:
            // dispatch(clearUser())
            // navigation.reset(...)
          }}
        >
          <MaterialIcons
            name="logout"
            size={22}
            color="#D96A27"
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
 

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2563EB",
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
    fontWeight: "600",
  },

  activeText: {
    color: "#D96A27",
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
    paddingVertical: 14,
    borderRadius: 8,
  },

  logoutText: {
    marginLeft: 10,
    color: "#D96A27",
    fontSize: 16,
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    marginTop: 16,
    color: "#94A3B8",
    fontSize: 12,
  },
});