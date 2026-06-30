import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpTxnId: null,
  loginTxnId: null,
  abhaNumber: null,
  tToken: null,
  txnId: null,
  activeUser: null
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

     setActiveUser: (
      state,
      action
    ) => {
      state.activeUser =
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

    setTxnId: (
      state,
      action
    ) => {
      state.txnId =
        action.payload;
    },

    clearTxnId: (state) => {
      state.txnId = null;
    },
  },
});

export const {
  setOtpTxnId,
  setLoginTxnId,
  setAbhaNumber,
  setTToken,
  clearFlow,
  setTxnId,
  clearTxnId,
  setActiveUser
} = abhaSlice.actions;

export default abhaSlice.reducer;