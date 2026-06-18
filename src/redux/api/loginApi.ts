 import { BASE_URL_API } from "../../utils/helpers";
import { setTxnId } from "../slices/abhaSlice";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

export interface RequestOtpPayload {
  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string;
  txnId?: string;
}
 

export interface RequestOtpPayload {
  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string;
  txnId?: string;
}

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestOtp: builder.mutation<any, RequestOtpPayload>({
      query: (body) => {
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

        return {
          url: `${BASE_URL_API}${END_POINTS.requestOtp}`,
          method: "POST",
          body,
        };
      },

      async onQueryStarted(
        arg,
        {
          dispatch,
          queryFulfilled,
        }
      ) {
        console.log(
          "========== onQueryStarted =========="
        );

        console.log(
          "Request Argument =>",
          JSON.stringify(arg, null, 2)
        );

        try {
          console.log(
            "Waiting For API Response..."
          );

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

          console.log(
            "Response txnId =>",
            data?.txnId
          );

          if (data?.txnId) {
            console.log(
              "Dispatching txnId =>",
              data.txnId
            );

            dispatch(
              setTxnId(
                data.txnId
              )
            );

            console.log(
              "txnId Dispatched Successfully"
            );
          } else {
            console.log(
              "txnId Not Found In Response"
            );
          }
        } catch (error: any) {
          console.log(
            "========== API ERROR =========="
          );

          console.log(
            "Raw Error =>",
            error
          );

          console.log(
            "Error Status =>",
            error?.error?.status ||
              error?.status
          );

          console.log(
            "Error Data =>",
            JSON.stringify(
              error?.error?.data ||
                error?.data,
              null,
              2
            )
          );

          console.log(
            "Error Message =>",
            error?.error?.error ||
              error?.message
          );
        }
      },
    }),
  }),
});

export const getPayload = (
  loginType: string,
  encryptedValue: string,
  txnId?: string,
): RequestOtpPayload => {
  switch (loginType) {
    case 'Mobile Number':
      return {
        scope: ['abha-login', 'mobile-verify'],
        loginHint: 'mobile',
        loginId: encryptedValue,
        otpSystem: 'abdm',
      };

    case 'ABHA Number':
      return {
        scope: ['abha-login', 'mobile-verify'],
        loginHint: 'abha-number',
        loginId: encryptedValue,
        otpSystem: 'abdm',
      };

    case 'ABHA Number Aadhaar':
      return {
        scope: ['abha-login', 'aadhaar-verify'],
        loginHint: 'abha-number',
        loginId: encryptedValue,
        otpSystem: 'aadhaar',
      };

    case 'Find ABHA':
      return {
        scope: [
          'abha-login',
          'search-abha',
          'mobile-verify',
        ],
        loginHint: 'index',
        loginId: encryptedValue,
        otpSystem: 'abdm',
        txnId,
      };

    default:
      throw new Error(
        `Unsupported loginType: ${loginType}`
      );
  }
};
 
export const {
  useRequestOtpMutation
} = loginApi;
