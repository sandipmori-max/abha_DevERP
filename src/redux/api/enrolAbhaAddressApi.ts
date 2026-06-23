import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_ENROL_ABHA_ADDRESS =
  true;

export interface EnrolAbhaAddressPayload {
  txnId: string;
  abhaAddress: string;
  preferred: number;
}

export const enrolAbhaAddressApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      enrolAbhaAddress:
        builder.mutation<
          any,
          EnrolAbhaAddressPayload
        >({
          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== ENROL ABHA ADDRESS =========="
            );

            console.log(
              "Request URL =>",
              END_POINTS.enrolAbhaAddress
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
              MOCK_ENROL_ABHA_ADDRESS
            ) {
              return {
                data: {
                  txnId:
                    "23acf181-339d-4771-b532-5c5df4a28d19",

                  healthIdNumber:
                    "91-7561-4088-XXXX",

                  preferredAbhaAddress:
                    "username1997@sbx",
                },
              };
            }

            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.enrolAbhaAddress}`,
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
              "========== ENROL ABHA ADDRESS onQueryStarted =========="
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
                "ABHA Address Creation Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                "========== ENROL ABHA ADDRESS ERROR =========="
              );

              console.log(
                error
              );
            }
          },
        }),
    }),
  });

export const getEnrolAbhaAddressPayload =
  (
    txnId: string,
    abhaAddress: string,
    preferred = 1
  ): EnrolAbhaAddressPayload => ({
    txnId,
    abhaAddress,
    preferred,
  });

export const {
  useEnrolAbhaAddressMutation,
} = enrolAbhaAddressApi;