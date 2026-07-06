import { RootState } from "../store";
import { baseApi } from "./baseApi";
import { showToast } from "../../utils/toast";
import { updateAuthToken } from "../slices/abhaSlice";

const MOCK_GET_AUTH = false;

export interface GetAuthPayload {
  appid: string;
  device: string;
}

export interface GetAuthResponse {
  success: number;
  message?: string;
  token?: string;
  [key: string]: any;
}

export const getAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuth: builder.mutation<GetAuthResponse, GetAuthPayload>({
      async queryFn(body, api, _extraOptions, baseQuery) {
        const state = api.getState() as RootState;

        const baseUrl = state.abha.devERPBaseUrl;
        const abhaDrProfile = state.abha.abhaDrProfile

        console.log("========== GET AUTH abhaDrProfile -----------  ==========", baseUrl,  abhaDrProfile);

        console.log(
          "Request URL =>",
          `${baseUrl}/getAuth`
        );

        console.log("Request Method => POST");

        console.log(
          "Request Body =>",
          JSON.stringify(body, null, 2)
        );

        // MOCK RESPONSE
        if (MOCK_GET_AUTH) {
          console.log(
            "========== MOCK GET AUTH RESPONSE =========="
          );

          return {
            data: {
              success: 1,
              message: "Authentication successful",
              token: "sample-token",
            },
          };
        }

        // ACTUAL API
        const response: any = await baseQuery({
          url: `${baseUrl}/getAuth`,
          method: "POST",
          body,
        });

        // If API returns { d: "....json...." }
        if (response.data?.d) {
          response.data = JSON.parse(response.data.d);
        }

        return response;
      },

      async onQueryStarted(
        arg,
        { 
            dispatch,
            queryFulfilled
        }
      ) {
        console.log(
          "========== GET AUTH onQueryStarted =========="
        );

        console.log(
          "Request Argument =>",
          JSON.stringify(arg, null, 2)
        );

        try {
          const result = await queryFulfilled;

          console.log(
            "Full Query Result =>",
            JSON.stringify(result, null, 2)
          );

          console.log(
            "Response Data =>",
            JSON.stringify(result.data, null, 2)
          );
          dispatch(updateAuthToken(JSON.stringify(result.data, null, 2)))

          // Agar token save karna ho to yaha dispatch kar sakte ho
        } catch (error) {
          showToast(
            "error",
            "Something went wrong. Please try again later."
          );

          console.log(
            "========== GET AUTH ERROR =========="
          );

          console.log(error);
        }
      },
    }),
  }),
});

export const getGetAuthPayload = (
  appid: string,
  device: string
): GetAuthPayload => ({
  appid,
  device,
});

export const {
  useGetAuthMutation,
} = getAuthApi;