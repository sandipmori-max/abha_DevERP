import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Header from "../../Components/Header";
import { getPageListPayload, useGetPageListMutation } from "../../redux/api/getPageList";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import AbhaUserItem from "./AbhaUserItem";
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ route }: any) => {

  const navigation = useNavigation()
  const activeUser = useSelector(
    (state: any) => state.abha.activeUser
  );
  console.log("abhaDractiveUserProfile-----", activeUser)
  const [getPageList, { data, isLoading, error }] = useGetPageListMutation();
  const [abhaUsersList, setAbhaUsersList] = useState<any>()
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoader())
        const response = await getPageList(
          getPageListPayload(
            activeUser?.token,
            "BusinessCardMst"
          )
        ).unwrap();
        console.log('response', response);
        setAbhaUsersList(response)
        dispatch(hideLoader())
      } catch (err) {
        console.log('err', err);
        dispatch(hideLoader())
      } finally {
        dispatch(hideLoader())
      }
    };

    if (activeUser?.token) {
      fetchData();
    }
  }, [activeUser?.token]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
         bounces={false}
      >
        <Header title="Dashboard" isSearch={true} isMenu={true} />
        <FlatList
          data={abhaUsersList}
          keyExtractor={(item) => item.txnId}
          renderItem={({ item }) => (
            <AbhaUserItem
              item={item}
              onPress={(item) => {
                navigation.navigate('Details', {
                  item
                })
              }}
            />
          )}
          ListFooterComponent={()=>{
            return(<View style={{height: 80, width: 10}}></View>)
          }}
        />
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