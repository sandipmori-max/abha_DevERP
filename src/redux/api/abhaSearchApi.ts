import {
    BASE_URL_API,
    getErrorMessage,
} from "../../utils/helpers";

import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";


const MOCK_SEARCH_ABHA_ADDRESS = false;


export const abhaSearchApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            searchAbhaAddress:
                builder.mutation<any, {
                    abhaAddress: string;
                }>({

                    async queryFn(
                        body,
                        _api,
                        _extraOptions,
                        baseQuery
                    ) {

                        console.log(
                            "========== ABHA SEARCH =========="
                        );


                        console.log(
                            "Request URL =>",
                            END_POINTS.searchAbhaAddress
                        );


                        console.log(
                            "Request Body =>",
                            JSON.stringify(body, null, 2)
                        );


                        // MOCK RESPONSE
                        if (MOCK_SEARCH_ABHA_ADDRESS) {

                            console.log(
                                "========== MOCK ABHA SEARCH RESPONSE =========="
                            );


                            if (
                                body.abhaAddress === "Sandip@abdm"
                            ) {

                                return {
                                    data: {

                                        healthIdNumber:
                                            "91-6167-8028-XXXX",

                                        abhaAddress:
                                            "singh128@sbx",

                                        authMethods: [
                                            "MOBILE_OTP",
                                            "AADHAAR_OTP"
                                        ],

                                        blockedAuthMethods: [],

                                        status:
                                            "ACTIVE",

                                        message:
                                            null,

                                        fullName:
                                            "Deepak Kumar Singh",

                                        mobile:
                                            "9340******"

                                    }
                                };

                            }


                            // MOCK FAILED RESPONSE
                            return {
                                error: {
                                    status: 404,
                                    data: {
                                        code:
                                            "ABDM-1211",

                                        message:
                                            "User not found."
                                    }
                                }
                            };

                        }



                        return await baseQuery({

                            url:
                                `${BASE_URL_API}${END_POINTS.searchAbhaAddress}`,

                            method:
                                "POST",

                            body,

                        });

                    },


                    async onQueryStarted(
                        arg,
                        {
                            queryFulfilled,
                        }
                    ) {


                        try {


                            const result =
                                await queryFulfilled;


                            console.log(
                                "========== ABHA SEARCH RESPONSE =========="
                            );


                            console.log(
                                JSON.stringify(
                                    result.data,
                                    null,
                                    2
                                )
                            );


                        } catch (error: any) {


                            console.log(
                                "========== ABHA SEARCH ERROR =========="
                            );


                            console.log(
                                error
                            );


                            showToast(
                                "error",
                                "ABHA Search Failed",
                                getErrorMessage(error)
                            );


                        }


                    },


                }),

        }),
    });



export const {
    useSearchAbhaAddressMutation,
} = abhaSearchApi;