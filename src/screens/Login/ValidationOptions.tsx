import React from "react";
import { View, Text } from "react-native";
import RadioItem from "./RadioItem"; 
import { styles } from "./style";

interface Props {
  title?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const ValidationOptions = ({
  title = "Verification Method",
  options,
  value,
  onChange,
}: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {title}
      </Text>

      {options.map((item) => (
        <RadioItem
          key={item}
          title={item}
          selected={value === item}
          onPress={() => onChange(item)}
        />
      ))}
    </View>
  );
};

export default React.memo(ValidationOptions);