import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_PROFILE_QR = false;

export const profileQrCodeApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      profileQrCode: builder.query<any, void>({
        async queryFn(
          _arg,
          _api,
          _extraOptions,
          baseQuery
        ) {
          console.log(
            "========== PROFILE QR CODE =========="
          );

          console.log(
            "Request URL =>",
            END_POINTS.profileQrCode
          );

          console.log(
            "Request Method => GET"
          );

          // MOCK RESPONSE
          if (MOCK_PROFILE_QR) {
            return {
              data: {
                qrCode: "",
              },
            };
          }

          return await baseQuery({
            url: `${BASE_URL_API}${END_POINTS.profileQrCode}`,
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
              "========== PROFILE QR RESPONSE =========="
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
              "Profile QR Failed",
              getErrorMessage(error)
            );

            console.log(
              "========== PROFILE QR ERROR =========="
            );

            console.log(error);
          }
        },
      }),
    }),
  });

export const {
  useProfileQrCodeQuery,
  useLazyProfileQrCodeQuery,
} = profileQrCodeApi;