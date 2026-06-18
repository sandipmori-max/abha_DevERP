import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from "react-redux";
import { store } from './src/redux/store';
import GlobalLoader from './GlobalLoader';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig';


const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
        <GlobalLoader />
        <Toast config={toastConfig} 
        position="bottom"
  bottomOffset={40} />      
      </NavigationContainer>
    </Provider>

  );
};

export default App;

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import { configureStore, createSlice } from "@reduxjs/toolkit";

// import { ActivityIndicator, View } from "react-native";
// import Toast from "react-native-toast-message";

// /* ---------------------- LOADER SLICE ---------------------- */
// const loaderSlice = createSlice({
//   name: "loader",
//   initialState: {
//     loading: false,
//   },
//   reducers: {
//     showLoader: (state) => {
//       state.loading = true;
//     },
//     hideLoader: (state) => {
//       state.loading = false;
//     },
//   },
// });

// const { showLoader, hideLoader } = loaderSlice.actions;

// /* ---------------------- STORE ---------------------- */
// const store = configureStore({
//   reducer: {
//     loader: loaderSlice.reducer,
//   },
// });

// /* ---------------------- GLOBAL LOADER UI ---------------------- */
// const GlobalLoader = () => {
//   const loading = useSelector((state: any) => state.loader.loading);

//   if (!loading) return null;

//   return (
//     <View
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0,0,0,0.4)",
//         zIndex: 999,
//       }}
//     >
//       <ActivityIndicator size="large" color="#fff" />
//     </View>
//   );
// };

// /* ---------------------- MOCK API WRAPPER ---------------------- */
// /* (Tum yaha RTK Query ka baseQuery replace karna) */

// const fakeApiCall = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const success = true;

//       if (success) {
//         resolve({ message: "Success" });
//       } else {
//         reject(new Error("Failed"));
//       }
//     }, 1500);
//   });

// /* ---------------------- MAIN APP CONTENT ---------------------- */
// const AppContent = () => {
//   const dispatch = useDispatch();

//   const callApi = async () => {
//     try {
//       dispatch(showLoader());

//       const res = await fakeApiCall();

//       Toast.show({
//         type: "success",
//         text1: "API Success",
//       });

//       console.log(res);
//     } catch (e) {
//       Toast.show({
//         type: "error",
//         text1: "API Failed",
//       });
//     } finally {
//       dispatch(hideLoader());
//     }
//   };

//   return (
//     <NavigationContainer>
//       <GlobalLoader />

//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <View
//           onTouchEnd={callApi}
//           style={{
//             padding: 15,
//             backgroundColor: "black",
//             borderRadius: 8,
//           }}
//         >
//           <ActivityIndicator />
//         </View>
//       </View>

//       <Toast />
//     </NavigationContainer>
//   );
// };

// /* ---------------------- ROOT APP ---------------------- */
// const App = () => {
//   return (
//     <Provider store={store}>
//       <AppContent />
//     </Provider>
//   );
// };

// export default App;