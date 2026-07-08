import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import CustomBottomSheet from "../screens/Profile/CustomBottomSheet";

const Header = ({
  setSearch,
  setSearchActive,
  search,
  seachActive,
  title,
  handleSearch,
  inputRef,
  isSearch = true, isMenu = true, isShare = false, handleShare }: {
    title: string, isSearch?: boolean, isMenu?: boolean,
    isShare?: boolean,
    handleShare: any,
    setSearch?: any,
    setSearchActive?: any,
    search?: any
    seachActive?: any,
    handleSearch?: any,
    inputRef?: any
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
      {
        seachActive ? <>
          <TextInput
            ref={inputRef}
            placeholder="Search here...."
            value={search}
            onChangeText={(e) => {
              setSearch(e)
            }}
            style={styles.searchInput}
          />
        </> : <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>{title}</Text>
      }


      {
        isSearch && <View style={styles.rightContainer}>
          <TouchableOpacity

            onPress={handleSearch}
            style={styles.iconBtn}>
            <MaterialIcons
              name={seachActive ? 'close' : 'search'}
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
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    fontWeight: '600'
  }
});

export default Header;