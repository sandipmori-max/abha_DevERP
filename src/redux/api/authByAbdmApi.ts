import { BASE_URL_API, getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_AUTH_BY_ABDM = false;

export interface AuthByAbdmPayload {
  scope: string[];

  authData: {
    authMethods: string[];

    otp: {
      timeStamp: string;
      txnId: string;
      otpValue: string;
    };
  };
}

export const authByAbdmApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      authByAbdm:
        builder.mutation<
          any,
          AuthByAbdmPayload
        >({
          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== AUTH BY ABDM =========="
            );

            console.log(
              "Request URL =>",
              END_POINTS.authByAbdm
            );

            console.log(
              "Request Method => POST"
            );

            console.log(
              "Request Body =>",
              JSON.stringify(
                body,
                null,
                2
              )
            );

            // MOCK RESPONSE
            if (
              MOCK_AUTH_BY_ABDM
            ) {
              console.log(
                "========== MOCK AUTH BY ABDM RESPONSE =========="
              );

              return {
                data: {
                  txnId:
                    "23acf181-339d-4771-b532-5c5df4a28d19",

                  authResult:
                    "success",

                  message:
                    "Mobile number is now successfully linked to your Account",

                  accounts: [
                    {
                      ABHANumber:
                        "91-7561-4088-XXXX",
                    },
                  ],
                },
              };
            }

            // ACTUAL API
            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.authByAbdm}`,
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
              "========== AUTH BY ABDM onQueryStarted =========="
            );

            console.log(
              "Request Argument =>",
              JSON.stringify(
                arg,
                null,
                2
              )
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

              console.log(
                "Response Data =>",
                JSON.stringify(
                  result.data,
                  null,
                  2
                )
              );

              if (
                result.data
                  ?.authResult ===
                "success"
              ) {
                showToast(
                  "success",
                  "Success",
                  result.data
                    ?.message
                );
              }
            } catch (
              error: any
            ) {
              showToast(
                "error",
                "Mobile Verification Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                "========== AUTH BY ABDM ERROR =========="
              );

              console.log(
                error
              );
            }
          },
        }),
    }),
  });

export const getAuthByAbdmPayload =
  (
    txnId: string,
    encryptedOtp: string
  ): AuthByAbdmPayload => ({
    scope: [
      "abha-enrol",
      "mobile-verify",
    ],

    authData: {
      authMethods: [
        "otp",
      ],

      otp: {
        timeStamp:
          new Date()
            .toISOString()
            .replace(
              "T",
              " "
            )
            .substring(
              0,
              19
            ),

        txnId,

        otpValue:
          encryptedOtp,
      },
    },
  });

export const {
  useAuthByAbdmMutation,
} = authByAbdmApi;