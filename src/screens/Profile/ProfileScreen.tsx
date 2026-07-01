import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import Header from "../../Components/Header";

const ProfileScreen = ({ route }: any) => {


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <Header title="Dashboard" />

      </ScrollView>
    </SafeAreaView>
  );
};

 
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
});