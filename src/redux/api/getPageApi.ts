import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { RootState } from "../store";


const MOCK_GET_PAGE = false;


export interface GetPagePayload {
    token: string;
    page: string;
    id: string;
}


export const getPageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        
        getPage: builder.mutation<any, GetPagePayload>({
            
            async queryFn(
                body,
                api,
                _extraOptions,
                baseQuery
            ) {

                console.log(
                    "========== GET PAGE =========="
                );

                console.log(
                    "Request Body =>",
                    JSON.stringify(body, null, 2)
                );


                // ================= MOCK =================
                if (MOCK_GET_PAGE) {

                    return {
                        data: {
                            message: "Profile fetched successfully",
                            id: "3",
                            page: "PatientABHAProfile",
                            name: "Rahul Sharma",
                            mobile: "9999999999",
                            abhaNumber: "91-1234-5678-0001"
                        }
                    };
                }


                // ================= ACTUAL API =================

                const state = api.getState() as RootState;

                const baseUrl = state.abha.devERPBaseUrl;


                return await baseQuery({
                    url: `${baseUrl}/getPage`,
                    method: "POST",
                    body,
                });

            },


            async onQueryStarted(
                arg,
                {
                    queryFulfilled
                }
            ) {

                console.log(
                    "========== GET PAGE START =========="
                );

                console.log(
                    "Arguments =>",
                    JSON.stringify(arg, null, 2)
                );


                try {

                    const result = await queryFulfilled;


                    console.log(
                        "Response =>",
                        JSON.stringify(result.data, null, 2)
                    );


                } catch(error:any){

                    showToast(
                        "error",
                        "Get Page Failed",
                        getErrorMessage(error)
                    );


                    console.log(
                        "GET PAGE ERROR",
                        error
                    );

                }

            },


        }),

    }),
});


export const getPagePayload = (
    token:string,
    page:string,
    id:string
):GetPagePayload => ({
    token,
    page,
    id
});


export const {
    useGetPageMutation
} = getPageApi;