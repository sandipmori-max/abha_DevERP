import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from './style';

 const RadioItem = ({
    title,
    selected,
    onPress,
  }: any) => (
    <TouchableOpacity
      style={styles.radioRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.radioOuter,
          selected &&
          styles.radioOuterActive,
        ]}
      >
        {selected && (
          <View style={styles.radioInner} />
        )}
      </View>

      <Text style={styles.radioText}>
        {title}
      </Text>
    </TouchableOpacity>
  );

export default RadioItem
 