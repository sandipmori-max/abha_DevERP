import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

interface AadhaarInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const AadhaarInput = ({
  value = "",
  onChange,
}: AadhaarInputProps) => {
  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);
  const [showAadhaar, setShowAadhaar] = useState(false);

  const [errors, setErrors] = useState({
    part1: false,
    part2: false,
    part3: false,
  });

  const [focusedInput, setFocusedInput] = useState<
    "part1" | "part2" | "part3" | null
  >(null);

  const [aadhaar, setAadhaar] = useState({
    part1: "",
    part2: "",
    part3: "",
  });

  useEffect(() => {
  const numbers = value.replace(/\D/g, "");

  const current =
    aadhaar.part1 + aadhaar.part2 + aadhaar.part3;

  if (numbers !== current) {
    setAadhaar({
      part1: numbers.slice(0, 4),
      part2: numbers.slice(4, 8),
      part3: numbers.slice(8, 12),
    });
  }
}, [value]);

  const updateValue = (
    part1: string,
    part2: string,
    part3: string
  ) => {
    onChange(part1 + part2 + part3);
  };

  const getBorderColor = (key: "part1" | "part2" | "part3") => {
    if (errors[key]) {
      return "#EF4444"; // Red
    }

    if (aadhaar[key].length === 4) {
      return "#22C55E"; // Green
    }

    if (focusedInput === key) {
      return "#2563EB"; // Blue
    }

    return "#D1D5DB"; // Gray
  };

  return (
    <>
     <View style={styles.container}>
      {/* Part 1 */}

      <TextInput
        ref={input1Ref}
        style={[
          styles.box,
          {
            borderColor: getBorderColor("part1"),
          },
        ]}
        value={aadhaar.part1}
        keyboardType="number-pad"
        placeholder="0000"
        maxLength={4}
         placeholderTextColor="#999999"
        secureTextEntry={!showAadhaar}
        onFocus={() => setFocusedInput("part1")}
        onBlur={() => {
          setFocusedInput(null);

          setErrors(prev => ({
            ...prev,
            part1: aadhaar.part1.length > 0 && aadhaar.part1.length < 4,
          }));
        }}
        onChangeText={(text) => {
          const value = text.replace(/\D/g, "");

          setAadhaar((prev) => {
            const updated = {
              ...prev,
              part1: value,
            };

            updateValue(
              updated.part1,
              updated.part2,
              updated.part3
            );

            return updated;
          });

          if (value.length === 4) {
            input2Ref.current?.focus();
          }
        }}
      />

      <View style={styles.separator} />

      {/* Part 2 */}

      <TextInput
        ref={input2Ref}
        style={[
          styles.box,
          {
            borderColor: getBorderColor("part2"),
          },
        ]}
        secureTextEntry={!showAadhaar}
        value={aadhaar.part2}
        keyboardType="number-pad"
        placeholder="0000"
        maxLength={4}
         placeholderTextColor="#999999"
        onFocus={() => setFocusedInput("part2")}
        onBlur={() => {
          setFocusedInput(null);

          setErrors(prev => ({
            ...prev,
            part2: aadhaar.part2.length > 0 && aadhaar.part2.length < 4,
          }));
        }}
        onKeyPress={({ nativeEvent }) => {
          if (
            nativeEvent.key === "Backspace" &&
            aadhaar.part2.length === 0
          ) {
            input1Ref.current?.focus();
          }
        }}
        onChangeText={(text) => {
          const value = text.replace(/\D/g, "");

          setAadhaar((prev) => {
            const updated = {
              ...prev,
              part2: value,
            };

            updateValue(
              updated.part1,
              updated.part2,
              updated.part3
            );

            return updated;
          });

          if (value.length === 4) {
            input3Ref.current?.focus();
          }
        }}
      />

      <View style={styles.separator} />

      {/* Part 3 */}

      <TextInput
        ref={input3Ref}
        style={[
          styles.box,
          {
            borderColor: getBorderColor("part3"),
          },
        ]}
         placeholderTextColor="#999999"
        secureTextEntry={!showAadhaar}
        value={aadhaar.part3}
        keyboardType="number-pad"
        placeholder="0000"
        maxLength={4}
        onFocus={() => setFocusedInput("part3")}
        onBlur={() => {
          setFocusedInput(null);

          setErrors(prev => ({
            ...prev,
            part3: aadhaar.part3.length > 0 && aadhaar.part3.length < 4,
          }));
        }}
        onKeyPress={({ nativeEvent }) => {
          if (
            nativeEvent.key === "Backspace" &&
            aadhaar.part3.length === 0
          ) {
            input2Ref.current?.focus();
          }
        }}
        onChangeText={(text) => {
          const value = text.replace(/\D/g, "");

          setAadhaar((prev) => {
            const updated = {
              ...prev,
              part3: value,
            };

            updateValue(
              updated.part1,
              updated.part2,
              updated.part3
            );

            return updated;
          });
        }}
      />

      <View style={{ padding: 4, marginHorizontal: 6 }}>
        <TouchableOpacity
          onPress={() => setShowAadhaar(prev => !prev)}
        >
          <MaterialIcons
            name={showAadhaar ? "visibility-off" : "visibility"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>
    </View>
   
    </>
   
  );
};

export default React.memo(AadhaarInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  box: {
    height: 40,
    width: 70,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center", 
    fontWeight: "600",
  },

  separator: {
    width: 8,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
});