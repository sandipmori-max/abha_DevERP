import { Platform } from "react-native";
import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";

const MOCK_GET_LINK = false;

export interface GetLinkPayload {
  code: string;
}

export interface GetLinkResponse {
  d: string;
}

export const getLinkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLink: builder.mutation<
      GetLinkResponse,
      GetLinkPayload
    >({
      async queryFn(
        body,
        _api,
        _extraOptions,
        baseQuery
      ) {
        console.log("========== GET LINK ==========");

        console.log(
          "Request URL =>",
          "https://support.deverp.net/devws/appcode.aspx/getLink"
        );

        console.log("Request Method => POST");

        console.log(
          "Request Body =>",
          JSON.stringify(body, null, 2)
        );

        // MOCK RESPONSE
        if (MOCK_GET_LINK) {
          console.log(
            "========== MOCK GET LINK RESPONSE =========="
          );

          return {
            data: {
              d: "https://support.deverp.net/deverp"
            },
          };
        }
        let url = Platform.OS === "android" ? "http://support.deverp.net/devws/appcode.aspx/getLink"  : "https://support.deverp.net/devws/appcode.aspx/getLink";

        return await baseQuery({
          url,
          method: "POST",
          body,
          
        });
      },

      async onQueryStarted(
        arg,
        { queryFulfilled }
      ) {
        console.log(
          "========== GET LINK onQueryStarted =========="
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

        //   showToast(
        //     "success",
        //     "Success",
        //     "Link fetched successfully."
        //   );
        } catch (error: any) {
          // showToast(
          //   "error", 
          //    JSON.stringify(error, null, 2)
          // );

          console.log(
            "========== GET LINK ERROR =========="
          );

          console.log(error);
        }
      },
    }),
  }),
});

export const getLinkPayload = (
  code: string
): GetLinkPayload => ({
  code,
});

export const {
  useGetLinkMutation,
} = getLinkApi;