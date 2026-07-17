import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_LOGIN_VERIFY_USER = false;

export interface LoginVerifyUserPayload {
  ABHANumber: string;
  txnId: string;
}

export const loginVerifyUserApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      loginVerifyUser: builder.mutation<
        any,
        LoginVerifyUserPayload
      >({
        async queryFn(
          body,
          _api,
          _extraOptions,
          baseQuery
        ) {
          console.log(
            "========== LOGIN VERIFY USER =========="
          );

          console.log(
            "Request URL =>",
            END_POINTS.loginVerifyUser
          );

          console.log(
            "Request Method => POST"
          );

          console.log(
            "Request Body =>",
            JSON.stringify(body, null, 2)
          );

          if (MOCK_LOGIN_VERIFY_USER) {
            return {
              data: {
                token: "mock_user_token",
                expiresIn: 1800,
                refreshToken:
                  "mock_refresh_token",
                refreshExpiresIn: 1296000,
              },
            };
          }

          return await baseQuery({
            url: `${BASE_URL_API}${END_POINTS.loginVerifyUser}`,
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
            "========== LOGIN VERIFY USER onQueryStarted =========="
          );

          console.log(
            "Request Argument =>",
            JSON.stringify(arg, null, 2)
          );

          try {
            const result =
              await queryFulfilled;

            console.log(
              "Full Response =>",
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

            if (data?.token) {
              console.log(
                "User Login Verified Successfully"
              );

              // dispatch(setUserToken(data.token))
              // dispatch(setRefreshToken(data.refreshToken))
            }
          } catch (error: any) {
            showToast(
              "error",
              "User Verification Failed",
              getErrorMessage(error)
            );

            console.log(
              "========== LOGIN VERIFY USER ERROR =========="
            );

            console.log(error);
          }
        },
      }),
    }),
  });

export const {
  useLoginVerifyUserMutation,
} = loginVerifyUserApi;


export const getLoginVerifyUserPayload = (
  abhaNumber: string,
  txnId: string
): LoginVerifyUserPayload => ({
  ABHANumber: abhaNumber,
  txnId,
});
