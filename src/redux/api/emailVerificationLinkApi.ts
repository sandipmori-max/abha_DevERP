import { BASE_URL_API, getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_EMAIL_VERIFICATION_LINK = true;

export interface EmailVerificationLinkPayload {
  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string;
}

export const emailVerificationLinkApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      requestEmailVerificationLink:
        builder.mutation<
          any,
          EmailVerificationLinkPayload
        >({
          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {
            console.log(
              "========== EMAIL VERIFICATION LINK =========="
            );

            console.log(
              "Request URL =>",
              END_POINTS.requestEmailVerificationLink
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
              MOCK_EMAIL_VERIFICATION_LINK
            ) {
              return {
                data: {
                  message:
                    "Verification link sent successfully to email address",
                },
              };
            }

            // ACTUAL API
            return await baseQuery({
              url: `${BASE_URL_API}${END_POINTS.requestEmailVerificationLink}`,
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
              "========== EMAIL VERIFICATION LINK onQueryStarted =========="
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

              showToast(
                "success",
                "Success",
                result.data
                  ?.message ||
                  "Verification link sent"
              );
            } catch (
              error: any
            ) {
              showToast(
                "error",
                "Email Verification Failed",
                getErrorMessage(
                  error
                )
              );

              console.log(
                error
              );
            }
          },
        }),
    }),
  });

export const getEmailVerificationLinkPayload =
  (
    encryptedEmail: string
  ): EmailVerificationLinkPayload => ({
    scope: [
      "abha-profile",
      "email-link-verify",
    ],

    loginHint: "email",

    loginId:
      encryptedEmail,

    otpSystem: "abdm",
  });

export const {
  useRequestEmailVerificationLinkMutation,
} =
  emailVerificationLinkApi;