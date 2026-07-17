import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_ENROL_SUGGESTION =
  false;

export interface EnrolSuggestionPayload {
  txnId: string;
}

export const enrolSuggestionApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      enrolSuggestion:
        builder.mutation<
          any,
          EnrolSuggestionPayload
        >({
          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== ENROL SUGGESTION =========="
            );

            console.log(
              "Transaction Id =>",
              body.txnId
            );

            // MOCK RESPONSE
            if (
              MOCK_ENROL_SUGGESTION
            ) {
              return {
                data: {
                  txnId:
                    "23acf181-339d-4771-b532-5c5df4a28d19",

                  abhaAddressList:
                    [
                      "Username.2661997",
                      "Usernamehelke_1997",
                      "Username_1997",
                      "Username266",
                      "Username_26",
                      "Username.1997",
                      "Username",
                      "26_Username.shelke",
                      "Usernamel1997",
                      "Usernameshelke1997",
                      "Username_shelke",
                      "Username2661997",
                      "Username.266",
                    ],
                },
              };
            }

            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.enrolSuggestion}`,
              method: "GET",

              headers: {
                Transaction_Id:
                  body.txnId,
              },
            });
          },

          async onQueryStarted(
            arg,
            {
              queryFulfilled,
            }
          ) {
            console.log(
              "========== ENROL SUGGESTION onQueryStarted =========="
            );

            try {
              const result =
                await queryFulfilled;

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
                "ABHA Suggestion Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                "========== ENROL SUGGESTION ERROR =========="
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
  useEnrolSuggestionMutation,
} = enrolSuggestionApi;