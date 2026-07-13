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
                  "preferredAbhaAddress": "++++++++++++++sandip1997@sbx",
                  "mobile": "8154877969",
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