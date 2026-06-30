import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomBottomSheet = ({
  visible,
  title,
  onClose,
  children,
}: Props) => {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : height,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity
            onPress={onClose}
            hitSlop={10}
          >
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 25,
    minHeight: 250,
    maxHeight: "90%",
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  close: {
    fontSize: 22,
    color: "#64748B",
  },

  content: {
    padding: 20,
  },
});