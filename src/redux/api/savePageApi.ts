import { RootState } from "../store";
import { baseApi } from "./baseApi";
import { showToast } from "../../utils/toast";

const MOCK_SAVE_PAGE = false;

export interface SavePagePayload {
  token: string;
  page: string;
  data: string; // JSON string
}

export interface SavePageResponse {
  success: number;
  message?: string;
  [key: string]: any;
}

export const savePageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    savePage: builder.mutation<SavePageResponse, SavePagePayload>({
      async queryFn(body, api, _extraOptions, baseQuery) {
        const state = api.getState() as RootState;
        const baseUrl = state.abha.devERPBaseUrl;

        console.log("========== SAVE PAGE ==========");
        console.log("Request URL =>", `${baseUrl}/savePage`);
        console.log("Request Method => POST");
        console.log(
          "Request Body =>",
          JSON.stringify(body, null, 2)
        );

        // MOCK RESPONSE
        if (MOCK_SAVE_PAGE) {
          console.log("========== MOCK SAVE PAGE RESPONSE ==========");

          return {
            data: {
              success: 1,
              message: "Page saved successfully",
            },
          };
        }

        // ACTUAL API
        const response: any = await baseQuery({
          url: `${baseUrl}/savePage`,
          method: "POST",
          body,
        });

        // If API returns { d: "....json...." }
        if (response.data?.d) {
          response.data = JSON.parse(response.data.d);
        }

        return response;
      },

      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("========== SAVE PAGE onQueryStarted ==========");
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
        } catch (error) {
          showToast(
            "error",
            "Something went wrong. Please try again later."
          );

          console.log("========== SAVE PAGE ERROR ==========");
          console.log(error);
        }
      },
    }),
  }),
});

export const getSavePagePayload = (
  token: string,
  page: string,
  data: string
): SavePagePayload => ({
  token,
  page,
  data,
});

export const { useSavePageMutation } = savePageApi;