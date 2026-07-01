import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { RootState } from "../store";
import { baseApi } from "./baseApi";

const MOCK_SET_APP_ID = false;

export interface SetAppIdPayload {
    user: string;
    pass: string;
    appid: string;
    firebaseid: string;
    device: string;
}

export interface SetAppIdResponse {
    success: number;
    message?: string;
}

export const setAppIdApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        setAppId: builder.mutation<
            SetAppIdResponse,
            SetAppIdPayload
        >({
            async queryFn(
                body,
                _api,
                _extraOptions,
                baseQuery
            ) {

                const state = _api.getState() as RootState;

                const baseUrl = state.abha.devERPBaseUrl;

                console.log("========== SET APP ID ==========");

                console.log(
                    "Request URL =>",
                    `${baseUrl}/setAppId`
                );

                console.log(
                    "Request Method => POST"
                );

                console.log(
                    "Request Body =>",
                    JSON.stringify(body, null, 2)
                );

                // MOCK RESPONSE
                if (MOCK_SET_APP_ID) {
                    console.log(
                        "========== MOCK SET APP ID RESPONSE =========="
                    );

                    return {
                        data: {
                            success: 1,
                            message: "App Id updated successfully",
                        },
                    };
                }

                // ACTUAL API
                const response: any = await baseQuery({
                    url: `${baseUrl}/setAppId`,
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
                { queryFulfilled }
            ) {
                console.log(
                    "========== SET APP ID onQueryStarted =========="
                );

                console.log(
                    "Request Argument =>",
                    JSON.stringify(arg, null, 2)
                );

                try {
                    const result =
                        await queryFulfilled;

                    console.log(
                        "Full Query Result =>",
                        JSON.stringify(result, null, 2)
                    );

                    console.log(
                        "Response Data =>",
                        JSON.stringify(result.data, null, 2)
                    );

                    if (result.data?.success === 1) {
                        showToast(
                            "success", 
                            "Login successfully."
                        );
                    }
                } catch (error: any) {
                    showToast(
                        "error", 
                        'Something went wrong. Please try again later.'
                    );

                    console.log(
                        "========== SET APP ID ERROR =========="
                    );

                    console.log(error);
                }
            },
        }),
    }),
});

export const getSetAppIdPayload = (
    user: string,
    pass: string,
    appid: string,
    firebaseid: string,
    device: string
): SetAppIdPayload => ({
    user,
    pass,
    appid,
    firebaseid,
    device,
});

export const {
    useSetAppIdMutation,
} = setAppIdApi;