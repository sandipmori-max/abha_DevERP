import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
 
interface Props {
  visible: boolean;
  onClose: () => void;
}

const EnrollmentInfoModal = ({ visible, onClose }: Props) => {
  return (
   <Modal
  visible={visible}
  transparent
  animationType="fade"
>
  <View style={styles.overlay}>
    <View style={styles.modal}>

      <TouchableOpacity
        style={styles.closeBtn}
        onPress={onClose}
      >
        <MaterialIcons name="close" size={22} color="#6B7280" />
      </TouchableOpacity>

      <View style={styles.warningCircle}>
        <MaterialIcons
          name='add-alert'
          size={42}
          color="#F97316"
        />
      </View>

      <Text style={styles.title}>
        Important Instructions
      </Text>

      <Text style={styles.subtitle}>
        Please read the following information carefully.
      </Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: "#EEF2FF" }]}>
          <Text style={[styles.badgeText, { color: "#4F46E5" }]}>
            1
          </Text>
        </View>

        <Text style={styles.message}>
          You can initiate the request for ABHA number however, you will receive only enrolment number on this portal.
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: "#FFF7ED" }]}>
          <Text style={[styles.badgeText, { color: "#F97316" }]}>
            2
          </Text>
        </View>

        <Text style={styles.message}>
          Carry your Driving License to the nearest{" "}
          <Text style={styles.highlight}>
            ABDM participating facility
          </Text>{" "}
          to complete verification and obtain your ABHA number.
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
      >
        <Text style={styles.buttonText}>
            Got it
          </Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>
  );
};

export default EnrollmentInfoModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },

  closeBtn: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  warningCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF4ED",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  title: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 28,
  },

  row: {
    flexDirection: "row",
    marginBottom: 26,
    alignItems: "flex-start",
  },

  badge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  badgeText: {
    fontSize: 24,
    fontWeight: "700",
  },

  message: {
    flex: 1,
    fontSize: 17,
    color: "#374151",
    lineHeight: 30,
  },

  highlight: {
    color: "#F97316",
    fontWeight: "700",
  },

  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
});