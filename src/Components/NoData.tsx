// NoData.tsx

import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import { ABHA_ICON } from '../assets';

interface Props {
  title?: string;
  message?: string;
  buttonText?: string;
  onPress?: () => void;
}

const NoData = ({
  title = 'No Data Found',
  message = 'Currently there is no data available.',
  buttonText,
  onPress,
}: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={ABHA_ICON.NO_DATA}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.message}>
        {message}
      </Text>

      {buttonText && (
        <Pressable 
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>
            {buttonText}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default NoData;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});