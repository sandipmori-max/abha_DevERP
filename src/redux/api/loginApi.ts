import { BASE_URL_API, getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { setTxnId } from "../slices/abhaSlice";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_REQUEST_OTP = true;

export interface RequestOtpPayload {
  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string;
  txnId?: string;
}

export const loginApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    requestOtp: builder.mutation<
      any,
      RequestOtpPayload
    >({
      async queryFn(
        body,
        _api,
        _extraOptions,
        baseQuery
      ) {
        console.log(
          "========== REQUEST OTP =========="
        );

        console.log(
          "Request URL =>",
          END_POINTS.requestOtp
        );

        console.log(
          "Request Method => POST"
        );

        console.log(
          "Request Body =>",
          JSON.stringify(body, null, 2)
        );

        // MOCK RESPONSE
        if (MOCK_REQUEST_OTP) {
          console.log(
            "========== MOCK REQUEST OTP RESPONSE =========="
          );

          return {
            data: {
              txnId:
                "898bc1ee-ebf0-4a86-86e9-ec727fe1476c",
              message:
                "OTP sent to mobile number ending with ******1670",
            },
          };
        }

        // ACTUAL API CALL
        return await baseQuery({
          url: `${BASE_URL_API}${END_POINTS.requestOtp}`,
          method: "POST",
          body,
        });
      },

      async onQueryStarted(
        arg,
        {
          dispatch,
          queryFulfilled,
        }
      ) {
        console.log(
          "========== REQUEST OTP onQueryStarted =========="
        );

        console.log(
          "Request Argument =>",
          JSON.stringify(arg, null, 2)
        );

        try {
          const result =
            await queryFulfilled;

          console.log(
            "Full Query Result =>",
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

          if (data?.txnId) {
            dispatch(
              setTxnId(data.txnId)
            );

            console.log(
              "Login txnId saved =>",
              data.txnId
            );
          } else {
            console.log(
              "txnId not found in response"
            );
          }
        } catch (error: any) {
          const errorData =
            error?.error?.data ||
            error?.data;

          showToast(
            "error",
            "Login Failed",
            getErrorMessage(error)
          );

          console.log(
            "========== REQUEST OTP ERROR =========="
          );

          console.log(
            "Raw Error =>",
            error
          );

          console.log(
            "Error Data =>",
            JSON.stringify(
              errorData,
              null,
              2
            )
          );

          // ABDM Error Handling
          if (
            errorData?.loginId
          ) {
            console.log(
              "Invalid LoginId"
            );
          }

          if (
            errorData?.loginHint
          ) {
            console.log(
              "Invalid Login Hint"
            );
          }

          if (
            errorData?.code ===
            "900900"
          ) {
            console.log(
              "Invalid Access Token"
            );
          }
        }
      },
    }),
  }),
});

export const getPayload = (
  loginType: string,
  encryptedValue: string,
  txnId?: string
): RequestOtpPayload => {
  switch (loginType) {
    case "Mobile Number":
      return {
        scope: [
          "abha-login",
          "mobile-verify",
        ],
        loginHint: "mobile",
        loginId: encryptedValue,
        otpSystem: "abdm",
      };

    case "ABHA Number":
      return {
        scope: [
          "abha-login",
          "mobile-verify",
        ],
        loginHint:
          "abha-number",
        loginId: encryptedValue,
        otpSystem: "abdm",
      };

    case "Aadhaar Number":
      return {
        scope: [
          "abha-login",
          "aadhaar-verify",
        ],
        loginHint: "aadhaar",
        loginId: encryptedValue,
        otpSystem: "aadhaar",
      };

    case "Find ABHA":
      return {
        txnId,
        scope: [
          "abha-login",
          "search-abha",
          "mobile-verify",
        ],
        loginHint: "index",
        loginId: encryptedValue,
        otpSystem: "abdm",
      };

    default:
      throw new Error(
        `Unsupported loginType: ${loginType}`
      );
  }
};

export const {
  useRequestOtpMutation,
} = loginApi;