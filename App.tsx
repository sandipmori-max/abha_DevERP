import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from "react-redux";
import { persistor, store } from './src/redux/store';
import GlobalLoader from './GlobalLoader';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootNavigator />
          <GlobalLoader />
          <Toast config={toastConfig} topOffset={80} />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
 