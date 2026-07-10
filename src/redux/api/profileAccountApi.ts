import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_PROFILE_ACCOUNT = true;

export const profileAccountApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      profileAccount:
        builder.query<any, void>({
          async queryFn(
            _arg,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== PROFILE ACCOUNT =========="
            );

            console.log(
              "Request URL =>",
              END_POINTS.profileAccount
            );

            console.log(
              "Request Method => GET"
            );

            // MOCK RESPONSE
            if (
              MOCK_PROFILE_ACCOUNT
            ) {
              console.log(
                "========== MOCK PROFILE ACCOUNT RESPONSE =========="
              );

              return {
                data: {
                  
                  "ABHANumber": "91-7561-4088-XXXX",
                  "preferredAbhaAddress": "sandip1997@sbx",
                  "mobile": "8154870903",
                  "firstName": "Sandip test ",
                  "middleName": "Test",
                  "lastName": "Test",
                  "name": "sandip",
                  "yearOfBirth": "1999",
                  "dayOfBirth": "26",
                  "monthOfBirth": "06",
                  "gender": "M",
                  "profilePhoto": "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",
                  "status": "ACTIVE",
                  "stateCode": "27",
                  "districtCode": "478",
                  "pincode": "424201",
                  "address": "LOHARA, AT POST LOHARA TQ PACHORA DIST JALGAON, Lohara, Pachora, Jalgaon, Maharashtra",
                  "kycPhoto": "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",
                  "stateName": "MAHARASHTRA",
                  "districtName": "JALGAON",
                  "subdistrictName": "JALGAON",
                  "authMethods": [
                    "MOBILE_OTP",
                    "AADHAAR_BIO",
                    "AADHAAR_OTP",
                    "DEMOGRAPHICS",
                    "PASSWORD"
                  ],
                  "tags": {},
                  "kycVerified": true,
                  "verificationStatus": "VERIFIED",
                  "verificationType": "AADHAAR",
                  "localizedDetails": {
                    "name": "कैलास कैलास शेळके",
                    "stateName": "महाराष्ट्र",
                    "districtName": "जळगाव",
                    "villageName": "लोहारा",
                    "townName": "मु पोस्ट लोहारा ता पाचोरा जि. जळगाव",
                    "gender": "पुरुष",
                    "localizedLabels": {
                      "name": "नाव",
                      "abhaNumber": "आभा क्रमांक",
                      "abhaAddress": "आभा पत्ता",
                      "gender": "लिंग",
                      "dob": "जन्मतारीख",
                      "mobile": "मोबाईल"
                    }
                  },
                  "createdDate": "07-05-2024"
                },
              };
            }

            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.profileAccount}`,
              method: "GET",
            });
          },

          async onQueryStarted(
            _arg,
            {
              queryFulfilled,
            }
          ) {
            try {
              const result =
                await queryFulfilled;

              console.log(
                "========== PROFILE ACCOUNT RESPONSE =========="
              );

              console.log(
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
                "Profile Account Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                "========== PROFILE ACCOUNT ERROR =========="
              );

              console.log(
                error
              );
            }
          },
        }),
    }),
  });

export const {
  useProfileAccountQuery,
  useLazyProfileAccountQuery,
} = profileAccountApi;