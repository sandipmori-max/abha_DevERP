import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DetailsScreen = ({ navigation, route }) => {
  const { userId, name } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>

      <Text>User ID: {userId}</Text>
      <Text>Name: {name}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;

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
    marginTop: 20,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});