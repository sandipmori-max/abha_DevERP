import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, {
  forwardRef,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const COLORS = {
  primary: "#2563EB",
  success: "#16A34A",
  error: "#DC2626",
  border: "#CBD5E1",
  text: "#0F172A",
  placeholder: "#94A3B8",
  background: "#FFFFFF",
};

const CustomInput = forwardRef((props, ref) => {
  const {
    label,
    error,
    success = false,
    secure = false,
    style,
    ...rest
  } = props;

  const [focused, setFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secure);

  const borderColor = useMemo(() => {
    if (error) return COLORS.error;
    if (success) return COLORS.success;
    if (focused) return COLORS.primary;
    return COLORS.border;
  }, [error, success, focused]);

  return (
    <View style={styles.wrapper}>
      {!!label && (
        <Text style={styles.label}>
          {label} <Text style={{ color: 'red' }}>*</Text>
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
          },
        ]}
      >
        <TextInput
          ref={ref}
          {...rest}
          style={[
            styles.input,
            style,
          ]}
          placeholderTextColor={
            COLORS.placeholder
          }
          secureTextEntry={
            secure && hidePassword
          }
          autoCorrect={false}
          autoCapitalize={
            rest.autoCapitalize || "none"
          }
          onFocus={(e) => {
            setFocused(true);

            rest.onFocus &&
              rest.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);

            rest.onBlur &&
              rest.onBlur(e);
          }}
        />

        {secure && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              setHidePassword(
                !hidePassword
              )
            }
          >
             
            <MaterialIcons 
            name={hidePassword ? "visibility-off" : "visibility"}
            size={24}
            color={COLORS.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>

      {!!error && (
        <Text style={styles.error}>
          - {error}
        </Text>
      )}
    </View>
  );
});

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    minHeight: 46,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },

  eye: {
    fontSize: 20,
    marginLeft: 10,
  },

  error: {
    color: COLORS.error,
    marginTop: 6,
    fontSize: 13,
    marginLeft: 2,
  },
});