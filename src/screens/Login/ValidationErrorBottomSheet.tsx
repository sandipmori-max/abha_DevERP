import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  errors: string[];
  onClose: () => void;
}

const ValidationErrorBottomSheet = ({
  visible,
  errors,
  onClose,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                Validation Errors
              </Text>

              <Text style={styles.subtitle}>
                Please correct the following fields before continuing.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <MaterialIcons
                name="close"
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Error List */}
          <FlatList
            data={errors}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            
            renderItem={({ item }) => (
              <View style={styles.errorRow}>
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color="#D32F2F"
                />

                <Text style={styles.errorText}>
                  {item}
                </Text>
              </View>
            )}
          />

          {/* Footer */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              Continue Editing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ValidationErrorBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: "75%",
    marginHorizontal: 12
  },

  handle: {
    width: 48,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    paddingRight: 15,
  },

  list: {
    maxHeight: 320,  
    borderColor: "#ECECEC",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
  },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },

  errorText: {
    flex: 1,
    marginLeft: 12,
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
  },

  button: {
    height: 52,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: "#173D8F", // Use your app primary color
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});