import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import CustomBottomSheet from "../screens/Profile/CustomBottomSheet";

const Header = ({ title, isSearch = true, isMenu = true, isShare = false, handleShare }: {
  title: string, isSearch?: boolean, isMenu?: boolean,
  isShare?: boolean,
  handleShare: any
}) => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.header}>
      {/* Left Menu */}
      {
        isMenu ? <TouchableOpacity
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <MaterialIcons
            name="menu"
            size={30}
            color="#FFF"
          />
        </TouchableOpacity> : <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <MaterialIcons
            name='arrow-back'
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      }


      {/* Right Icons */}
      <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>{title}</Text>

      {
        isSearch && <View style={styles.rightContainer}>
          <TouchableOpacity

            onPress={() => {
              // setOpen(true)
            }}
            style={styles.iconBtn}>
            <MaterialIcons
              name='search'
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

      }
      {
        isShare && <View style={styles.rightContainer}>
          <TouchableOpacity

            onPress={() => {
              // setOpen(true)
              handleShare()
            }}
            style={styles.iconBtn}>
            <MaterialIcons
              name='share'
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      }


      {/* <TouchableOpacity style={styles.iconBtn}>
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
    </TouchableOpacity> */}

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#251d50",
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
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#fff'
  },
 
});

export default Header;