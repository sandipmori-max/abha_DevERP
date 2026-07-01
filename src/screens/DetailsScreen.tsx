import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Header from '../Components/Header';

const DetailsScreen = ({ navigation, route }: any) => {
  const { userId, name } = route.params || {};

  return (
   <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <Header title="Settings" />
         
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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