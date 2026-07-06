import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "../redux/slices/authSlice";
import abhaReducer from "../redux/slices/abhaSlice";
import loaderReducer from "../redux/slices/loaderSlice";

import { baseApi } from "../redux/api/baseApi";

/* ---------------- Persist Config ---------------- */

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ['publicKey', 'appId', 'deviceName'],
};

const abhaPersistConfig = {
  key: "abha",
  storage: AsyncStorage,
  whitelist: ["activeUser", "txnId", "tToken", "abhaDrProfile", "devERPBaseUrl"],
};

/* ---------------- Persisted Reducers ---------------- */

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

const persistedAbhaReducer = persistReducer(
  abhaPersistConfig,
  abhaReducer
);

/* ---------------- App Reducer ---------------- */

const appReducer = combineReducers({
  auth: persistedAuthReducer,
  abha: persistedAbhaReducer,
  loader: loaderReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

/* ---------------- Root Reducer ---------------- */

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }

  return appReducer(state, action);
};

/* ---------------- Store ---------------- */

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

/* ---------------- Persistor ---------------- */

export const persistor = persistStore(store);

/* ---------------- Types ---------------- */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;