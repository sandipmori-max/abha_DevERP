import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_ABHA_CARD = true;

export const abhaCardApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      profileAbhaCard: builder.query<any, void>({
        async queryFn(
          _arg,
          _api,
          _extraOptions,
          baseQuery
        ) {
          console.log(
            "========== PROFILE ABHA CARD =========="
          );

          console.log(
            "Request URL =>",
            END_POINTS.profileAbhaCard
          );

          console.log(
            "Request Method => GET"
          );

          // MOCK RESPONSE
          if (MOCK_ABHA_CARD) {
            return {
              data: {
                card: "969696969696",
              },
            };
          }

          return await baseQuery({
            url: `${BASE_URL_API}${END_POINTS.profileAbhaCard}`,
            method: "GET",
          });
        },

        async onQueryStarted(
          _arg,
          { queryFulfilled }
        ) {
          try {
            const result =
              await queryFulfilled;

            console.log(
              "========== PROFILE ABHA CARD RESPONSE =========="
            );

            console.log(
              JSON.stringify(
                result.data,
                null,
                2
              )
            );
          } catch (error: any) {
            showToast(
              "error",
              "ABHA Card Failed",
              getErrorMessage(error)
            );

            console.log(
              "========== PROFILE ABHA CARD ERROR =========="
            );

            console.log(error);
          }
        },
      }),
    }),
  });

export const {
  useProfileAbhaCardQuery,
  useLazyProfileAbhaCardQuery,
} = abhaCardApi;