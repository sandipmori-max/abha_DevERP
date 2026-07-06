import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpTxnId: null,
  loginTxnId: null,
  abhaNumber: null,
  tToken: null,
  txnId: null,
  activeUser: null,
  devERPBaseUrl: "",
  abhaDrProfile: ""
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
     setAbhaDrProfile: (
      state,
      action
    ) => {
      state.abhaDrProfile =
        action.payload;
    },

    updateAuthToken: (state, action) => {
      const payload =
        typeof action.payload === "string"
          ? JSON.parse(action.payload)
          : action.payload;

      state.activeUser = {
        ...state.activeUser,
        token: payload.token,
        validtill: payload.validTill,
      };
    },
     setDevERPBaseUrl: (
      state,
      action
    ) => {
      state.devERPBaseUrl =
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
  setActiveUser,
  setDevERPBaseUrl,
  setAbhaDrProfile,
  updateAuthToken
} = abhaSlice.actions;

export default abhaSlice.reducer;