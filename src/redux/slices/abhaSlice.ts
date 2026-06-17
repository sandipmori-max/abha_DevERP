import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpTxnId: null,
  loginTxnId: null,
  abhaNumber: null,
  tToken: null,
};

const abhaSlice = createSlice({
  name: "abha",

  initialState,

  reducers: {
    setOtpTxnId: (
      state,
      action
    ) => {
      state.otpTxnId =
        action.payload;
    },

    setLoginTxnId: (
      state,
      action
    ) => {
      state.loginTxnId =
        action.payload;
    },

    setAbhaNumber: (
      state,
      action
    ) => {
      state.abhaNumber =
        action.payload;
    },

    setTToken: (
      state,
      action
    ) => {
      state.tToken =
        action.payload;
    },

    clearFlow: (state) => {
      Object.assign(
        state,
        initialState
      );
    },
  },
});

export const {
  setOtpTxnId,
  setLoginTxnId,
  setAbhaNumber,
  setTToken,
  clearFlow,
} = abhaSlice.actions;

export default abhaSlice.reducer;