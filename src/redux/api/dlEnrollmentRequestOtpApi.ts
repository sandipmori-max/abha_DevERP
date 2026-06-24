import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { setTxnId } from "../slices/abhaSlice";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_DL_ENROLLMENT_OTP =
  true;

export interface DlEnrollmentRequestOtpPayload {
  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string;
}

export const dlEnrollmentRequestOtpApi =
  baseApi.injectEndpoints({
    endpoints: builder => ({
      dlEnrollmentRequestOtp:
        builder.mutation<
          any,
          DlEnrollmentRequestOtpPayload
        >({
          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== DL ENROLLMENT REQUEST OTP =========="
            );

            console.log(
              "Request URL =>",
              END_POINTS.dlEnrollmentRequestOtp
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
              MOCK_DL_ENROLLMENT_OTP
            ) {
              console.log(
                "========== MOCK DL ENROLLMENT OTP RESPONSE =========="
              );

              return {
                data: {
                  txnId:
                    "8f6752eb-0531-48fa-8aa0-48e64249d873",
                  message:
                    "OTP sent to mobile number ending with ******3640",
                },
              };
            }

            // ACTUAL API
            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.dlEnrollmentRequestOtp}`,
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
              "========== DL ENROLLMENT OTP onQueryStarted =========="
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

              const { data } =
                result;

              console.log(
                "Response Data =>",
                JSON.stringify(
                  data,
                  null,
                  2
                )
              );

              if (
                data?.txnId
              ) {
                dispatch(
                  setTxnId(
                    data.txnId
                  )
                );

                console.log(
                  "DL Enrollment txnId saved =>",
                  data.txnId
                );
              }
            } catch (
              error: any
            ) {
              showToast(
                "error",
                "DL Enrollment OTP Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                "========== DL ENROLLMENT OTP ERROR =========="
              );

              console.log(
                error
              );
            }
          },
        }),
    }),
  });

export const getDlEnrollmentRequestOtpPayload =
  (
    encryptedMobile: string
  ): DlEnrollmentRequestOtpPayload => ({
    scope: [
      "abha-enrol",
      "mobile-verify",
      "dl-flow",
    ],
    loginHint: "mobile",
    loginId:
      encryptedMobile,
    otpSystem: "abdm",
  });

export const {
  useDlEnrollmentRequestOtpMutation,
} =
  dlEnrollmentRequestOtpApi;