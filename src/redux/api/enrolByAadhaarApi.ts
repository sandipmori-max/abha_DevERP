import { BASE_URL_API, getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_ENROL_BY_AADHAAR = true;

export interface EnrolByAadhaarPayload {
  authData: {
    authMethods: string[];
    otp: {
      txnId: string;
      otpValue: string;
      mobile: string;
    };
  };
  consent: {
    code: string;
    version: string;
  };
}

export const enrolByAadhaarApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      enrolByAadhaar:
        builder.mutation<
          any,
          EnrolByAadhaarPayload
        >({
          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== ENROL BY AADHAAR =========="
            );

            console.log(
              "Request URL =>",
              END_POINTS.enrolByAadhaar
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
              MOCK_ENROL_BY_AADHAAR
            ) {
              console.log(
                "========== MOCK ENROL BY AADHAAR RESPONSE =========="
              );

              return {
                data: {
                  message:
                    "Account created successfully",
                  txnId:
                    "b89ec10d-71fa-4280-83b3-1fedad66b5f5",

                  tokens: {
                    token:
                      "mock-access-token",
                    expiresIn: 1800,
                    refreshToken:
                      "mock-refresh-token",
                    refreshExpiresIn:
                      1296000,
                  },

                  ABHAProfile: {
                    firstName:
                      "Username",
                    middleName:
                      "Kailas",
                    lastName:
                      "Shelke",
                    dob:
                      "26-06-1999",
                    gender: "M",
                    mobile:
                      "8154877969",

                    phrAddress: [
                      "9175614088XXXX@sbx",
                    ],

                    address:
                      "LOHARA, MAHARASHTRA",

                    districtCode:
                      "478",

                    stateCode:
                      "27",

                    pinCode:
                      "424201",

                    abhaType:
                      "STANDARD",

                    stateName:
                      "MAHARASHTRA",

                    districtName:
                      "JALGAON",

                    ABHANumber:
                      "91-7561-4088-XXXX",

                    abhaStatus:
                      "ACTIVE",
                  },

                  isNew: true,
                },
              };
            }

            // ACTUAL API
            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.enrolByAadhaar}`,
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
              "========== ENROL BY AADHAAR onQueryStarted =========="
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
            } catch (
              error: any
            ) {
              showToast(
                "error",
                "ABHA Enrollment Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                "========== ENROL BY AADHAAR ERROR =========="
              );

              console.log(
                error
              );
            }
          },
        }),
    }),
  });

export const getEnrolByAadhaarPayload =
  (
    txnId: string,
    encryptedOtp: string,
    mobile: string
  ): EnrolByAadhaarPayload => ({
    authData: {
      authMethods: ["otp"],
      otp: {
        txnId,
        otpValue:
        encryptedOtp,
        mobile,
      },
    },

    consent: {
      code:
        "abha-enrollment",
      version: "1.4",
    },
  });

export const {
  useEnrolByAadhaarMutation,
} = enrolByAadhaarApi;