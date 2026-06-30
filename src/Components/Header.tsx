import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const Header = ({ title }: { title: string }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
  {/* Left Menu */}
  <TouchableOpacity
    onPress={() =>
      navigation.dispatch(DrawerActions.openDrawer())
    }
  >
    <MaterialIcons
      name="menu"
      size={30}
      color="#FFF"
    />
  </TouchableOpacity>

  {/* Right Icons */}
  <View style={styles.rightContainer}>
    <TouchableOpacity style={styles.iconBtn}>
      <MaterialIcons
        name='qr-code'
        size={24}
        color="#FFF"
      />
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconBtn}>
      <MaterialIcons
        name="notifications-none"
        size={24}
        color="#FFF"
      />
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconBtn}>
      <MaterialIcons
        name="more-vert"
        size={24}
        color="#FFF"
      />
    </TouchableOpacity>
  </View>
</View>
  );
};

const styles = StyleSheet.create({
header: {
  height: 60,
  backgroundColor: "#D96A27",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
},

rightContainer: {
  flexDirection: "row",
  alignItems: "center",
},

iconBtn: {
  width: 40,
  height: 40,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 8,
  borderWidth: 1,
  borderColor: '#fff'
},
});

export default Header;