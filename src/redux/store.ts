import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "../redux/slices/authSlice";
import abhaReducer from "../redux/slices/abhaSlice";
import loaderReducer from "../redux/slices/loaderSlice";

import { baseApi } from "../redux/api/baseApi";

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: [],
};

const abhaPersistConfig = {
  key: "abha",
  storage: AsyncStorage,
  whitelist: ["activeUser", "txnId", "tToken"],
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

const persistedAbhaReducer = persistReducer(
  abhaPersistConfig,
  abhaReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    abha: persistedAbhaReducer,

    [baseApi.reducerPath]: baseApi.reducer,
    loader: loaderReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;