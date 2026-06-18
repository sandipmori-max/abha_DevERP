import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/slices/authSlice";
import abhaReducer from "../redux/slices/abhaSlice";
import loaderReducer from "../redux/slices/loaderSlice";


import { baseApi } from "../redux/api/baseApi";

export const store =
  configureStore({
    reducer: {
      auth: authReducer,
      abha: abhaReducer,

      [baseApi.reducerPath]:
        baseApi.reducer,
      loader: loaderReducer,

    },

    middleware: (
      getDefaultMiddleware
    ) =>
      getDefaultMiddleware().concat(
        baseApi.middleware
      ),
  });