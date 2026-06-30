import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import CustomBottomSheet from "../screens/Profile/CustomBottomSheet";

const Header = ({ title }: { title: string }) => {
    const navigation = useNavigation();
const [open, setOpen] = useState(false);

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
    <TouchableOpacity 
    
    onPress={()=>{
        setOpen(true)
    }}
    style={styles.iconBtn}>
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

  {
    open && <CustomBottomSheet
  visible={open}
  title="Share ABHA QR"
  onClose={() => setOpen(false)}
>
  <View style={styles.qrCard}>
    <Image
      source={{ uri: 'https://www.oreilly.com/api/v2/epubs/urn:orm:book:9781118370711/files/images/9781118370711-fg0101_fmt.png' }}
      style={styles.qrImage}
      resizeMode="contain"
    />

    <Text style={styles.qrInfo}>
      Scan this QR code to securely access and share your ABHA details.
    </Text>
  </View>

  <View style={styles.actionContainer}>
    <TouchableOpacity
      style={styles.shareBtn}
      activeOpacity={0.8}
    //   onPress={onShare}
    >
     <MaterialIcons
        name='share'
        size={24}
        color="#FFF"
      />

      <Text style={styles.shareText}>
        Share QR
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.downloadBtn}
      activeOpacity={0.8}
    //   onPress={onDownload}
    >
     <MaterialIcons
        name='downloading'
        size={24} 
      />

      <Text style={styles.downloadText}>
        Download
      </Text>
    </TouchableOpacity>
  </View>
</CustomBottomSheet>
  }
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
 qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  qrImage: {
    width: 200,
    height: 200,
  },

  qrInfo: {
    marginTop: 18,
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
  },

  actionContainer: {
    flexDirection: "row",
    marginTop: 28,
    justifyContent: "space-between",
  },

  shareBtn: {
    flex: 1,
    height: 52,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  downloadBtn: {
    flex: 1,
    height: 52,
    marginLeft: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF6B35",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#FFFFFF",
  },

  shareText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
     marginLeft : 8
  },

  downloadText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "700",
    marginLeft : 8
  },
});

export default Header;