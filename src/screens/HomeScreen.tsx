import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const goToDetails = () => {
    navigation.navigate('Details', {
      userId: 101,
      name: 'Sandip',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={goToDetails}
      >
        <Text style={styles.buttonText}>
          Go To Details
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});