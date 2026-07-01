import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_LOGIN_VERIFY = true;

export interface LoginVerifyPayload {
  scope: string[];
  authData: {
    authMethods: string[];
    otp: {
      txnId: string;
      otpValue: string;
    };
  };
}

export const loginVerifyApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      loginVerify: builder.mutation<
        any,
        LoginVerifyPayload
      >({
        async queryFn(
          body,
          _api,
          _extraOptions,
          baseQuery
        ) {
          console.log(
            "========== LOGIN VERIFY =========="
          );

          console.log(
            "Request URL =>",
            END_POINTS.verifyOtp
          );

          console.log(
            "Request Method => POST"
          );

          console.log(
            "Request Body =>",
            JSON.stringify(body, null, 2)
          );

          // MOCK RESPONSE
          if (MOCK_LOGIN_VERIFY) {
            return {
              data: {
                txnId:
                  "9fc6af6a-374f-4b6a-9cbe-791d360dfc28",
                authResult: "success",
                message:
                  "OTP verified successfully",
                token: "mock_access_token",
                expiresIn: 1800,
                refreshToken:
                  "mock_refresh_token",
                refreshExpiresIn: 1296000,
                accounts: [
                  {
                    ABHANumber:
                      "91-7561-4088-XXXX",
                    preferredAbhaAddress:
                      "username1997@sbx",
                    name:
                      "Username Kailas Shelke",
                    status: "ACTIVE",
                    profilePhoto: "",
                  },
                ],
              },
            };
          }

          // ACTUAL API
          return await baseQuery({
            url: `${BASE_URL_API}${END_POINTS.verifyOtp}`,
            method: "POST",
            body,
          });
        },

        async onQueryStarted(
          arg,
          {
            queryFulfilled,
          }
        ) {
          console.log(
            "========== LOGIN VERIFY onQueryStarted =========="
          );

          console.log(
            "Request Argument =>",
            JSON.stringify(arg, null, 2)
          );

          try {
            const result =
              await queryFulfilled;

            console.log(
              "Full Response =>",
              JSON.stringify(
                result,
                null,
                2
              )
            );

            const { data } = result;

            console.log(
              "Response Data =>",
              JSON.stringify(
                data,
                null,
                2
              )
            );

            if (
              data?.authResult ===
              "success"
            ) {
              console.log(
                "Login Verify Success"
              );

              // dispatch() if required
              // store token
              // store accounts
            }
          } catch (error: any) {
            showToast(
              "error",
              "Verification Failed",
              getErrorMessage(error)
            );

            console.log(
              "========== LOGIN VERIFY ERROR =========="
            );

            console.log(error);
          }
        },
      }),
    }),
  });

export const {
  useLoginVerifyMutation,
} = loginVerifyApi;


export const getLoginVerifyPayload = (
  loginType:
    | "Aadhaar Number"
    | "Mobile Number",
  txnId: string,
  encryptedOtp: string
): LoginVerifyPayload => {
  return {
    scope:
      loginType ===
      "Aadhaar Number"
        ? [
            "abha-login",
            "aadhaar-verify",
          ]
        : [
            "abha-login",
            "mobile-verify",
          ],

    authData: {
      authMethods: ["otp"],
      otp: {
        txnId,
        otpValue: encryptedOtp,
      },
    },
  };
};