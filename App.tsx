import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from "react-redux";
import { persistor, store } from './src/redux/store';
import GlobalLoader from './GlobalLoader';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, StatusBar } from "react-native";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={"#251d50"} />
            <SafeAreaView
              edges={["top"]}
              style={{ flex: 0, backgroundColor: "#251d50" }}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#251d50" }}>
              <RootNavigator />
              <GlobalLoader />
              <Toast config={toastConfig} topOffset={Platform.OS === 'ios' ? 70 : 80 } />
            </SafeAreaView>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
