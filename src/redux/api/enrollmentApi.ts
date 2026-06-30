import { BASE_URL_API, getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { setTxnId } from "../slices/abhaSlice";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_ENROLLMENT_OTP = false;

export interface EnrollmentRequestOtpPayload {
  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string;
  txnId?: string;
}

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enrollmentRequestOtp: builder.mutation<
      any,
      EnrollmentRequestOtpPayload
    >({
      async queryFn(
        body,
        _api,
        _extraOptions,
        baseQuery
      ) {
        console.log(
          "========== ENROLLMENT REQUEST OTP =========="
        );

        console.log(
          "Request URL =>",
          END_POINTS.enrollmentRequestOtp
        );

        console.log(
          "Request Method => POST"
        );

        console.log(
          "Request Body =>",
          JSON.stringify(body, null, 2)
        );

        // MOCK RESPONSE
        if (MOCK_ENROLLMENT_OTP) {
          console.log(
            "========== MOCK ENROLLMENT RESPONSE =========="
          );

          return {
            data: {
              txnId:
                "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
              message:
                "OTP sent to Aadhaar registered mobile number ending with ******0903",
            },
          };
        }

        // ACTUAL API CALL
        return await baseQuery({
          url: `${BASE_URL_API}${END_POINTS.enrollmentRequestOtp}`,
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
          "========== ENROLLMENT onQueryStarted =========="
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
              "Enrollment txnId saved =>",
              data.txnId
            );
          }
        } catch (error: any) {
          showToast(
            "error",
            "Enrollment Failed",
            getErrorMessage(error)
          );

          console.log(
            "========== ENROLLMENT API ERROR =========="
          );

          console.log(error);
        }
      },
    }),
  }),
});

 export const getEnrollmentPayload = (
  enrollmentType: string,
  encryptedValue: string,
  txnId?: string
): EnrollmentRequestOtpPayload => {
  switch (enrollmentType) {
    case "Aadhaar Number":
      return {
        txnId: txnId || "",
        scope: ["abha-enrol"],
        loginHint: "aadhaar",
        loginId: encryptedValue,
        otpSystem: "aadhaar",
      };

    case "Mobile Number":
      return {
        txnId,
        scope: [
          "abha-enrol",
          "mobile-verify",
        ],
        loginHint: "mobile",
        loginId: encryptedValue,
        otpSystem: "abdm",
      };

    case "DL Flow":
      return {
        scope: [
          "abha-enrol",
          "mobile-verify",
          "dl-flow",
        ],
        loginHint: "mobile",
        loginId: encryptedValue,
        otpSystem: "abdm",
      };

    default:
      throw new Error(
        `Unsupported enrollmentType: ${enrollmentType}`
      );
  }
};

export const {
  useEnrollmentRequestOtpMutation,
} = enrollmentApi;