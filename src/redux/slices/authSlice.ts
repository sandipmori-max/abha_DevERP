import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
   publicKey: null,
  encryptionAlgorithm: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setSession: (state, action) => {
      state.accessToken =
        action.payload.accessToken;

      state.refreshToken =
        action.payload.refreshToken;

      state.expiresIn =
        action.payload.expiresIn;
    },
    setCertificate:(state, action)=>{


      state.publicKey =
      action.payload.publicKey;


      state.encryptionAlgorithm =
      action.payload.encryptionAlgorithm;


    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
    },
  },
});

export const {
  setSession,
  setCertificate,
  logout,
} = authSlice.actions;

export default authSlice.reducer;