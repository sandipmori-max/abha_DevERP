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
                  ABHANumber:
                    "91-7561-4088-XXXX",

                  preferredAbhaAddress:
                    "username1997@sbx",

                  firstName:
                    "Username",

                  middleName:
                    "Kailas",

                  lastName:
                    "Shelke",

                  gender: "M",

                  dob:
                    "26-06-1999",

                  mobile:
                    "******0903",

                  email:
                    "username@test.com",

                  stateName:
                    "MAHARASHTRA",

                  districtName:
                    "JALGAON",

                  abhaStatus:
                    "ACTIVE",
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