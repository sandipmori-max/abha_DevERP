import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Header from "../../Components/Header";
import { getPageListPayload, useGetPageListMutation } from "../../redux/api/getPageList";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import AbhaUserItem from "./AbhaUserItem";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import NoData from "../../Components/NoData";
import { Directions } from "react-native-gesture-handler";

const ProfileScreen = ({ route }: any) => {

  const navigation = useNavigation()
  const activeUser = useSelector(
    (state: any) => state.abha.activeUser
  );
  console.log("abhaDractiveUserProfile-----", activeUser)
  const [getPageList, { data, isLoading, error }] = useGetPageListMutation();
  const [abhaUsersList, setAbhaUsersList] = useState<any>()
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [seachActive, setSearchActive] = useState(false)
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          dispatch(showLoader());

          const response = await getPageList(
            getPageListPayload(
              activeUser?.token,
              "PatientABHAProfile",
              "",
              "",
              "",
              ""
            )
          ).unwrap();

          console.log("response", response);

          const result = JSON.parse(response.d);
          const dataArray = result.data;

          console.log(dataArray);

          setAbhaUsersList(dataArray);

        } catch (err) {
          console.log("err", err);
        } finally {
          dispatch(hideLoader());
        }
      };

      if (activeUser?.token) {
        fetchData();
      }

      // optional cleanup
      return () => { };
    }, [activeUser?.token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
      keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        bounces={false}
      >
        <Header
          inputRef={inputRef}
          search={search}
          seachActive={seachActive}
          setSearch={setSearch}
          setSearchActive={setSearchActive}
          title="Dashboard"
          isSearch={true}
          isMenu={true}
          handleSearch={() => {
            inputRef.current?.focus();
            setSearch("")
            setSearchActive(!seachActive)
          }}

        />
        {
          !isLoading && abhaUsersList?.length > 0 ? <>

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
              ListFooterComponent={() => {
                return (<View style={{ height: 80, width: 10 }}></View>)
              }}
            />
          </> :
            <>
              {
                !isLoading && <View style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  height: Dimensions.get('screen').height * 0.75, width: Dimensions.get('screen').width
                }}>
                  <NoData />
                </View>
              }
            </>


        }


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