import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';

const GlobalLoader = () => {
  const loading = useSelector((state: any) => state.loader.loading);

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};

export default GlobalLoader;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  text: {
    marginTop: 16,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});