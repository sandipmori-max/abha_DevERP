import { BASE_URL_API, getErrorMessage, } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

const MOCK_ABHA_PROFILE = true;

export interface AbhaProfilePayload {
    json_web_token: string;
}


export const abhaProfileApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            abhaProfile:
                builder.query<any, AbhaProfilePayload>({

                    async queryFn(
                        params,
                        _api,
                        _extraOptions,
                        baseQuery
                    ) {

                        console.log(
                            "========== ABHA PROFILE =========="
                        );

                        console.log(
                            "Request URL =>",
                            END_POINTS.profileByToken
                        );

                        console.log(
                            "X-token =>",
                            params.json_web_token
                        );


                        if (MOCK_ABHA_PROFILE) {

                            return {
                                data: {
                                    "abhaAddress": "hemanttest@abdm",
                                    "fullName": "Hemant Prakash Bodhai",
                                    "profilePhoto": "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",
                                    "firstName": "Hemant",
                                    "middleName": "Prakash",
                                    "lastName": "Bodhai",
                                    "dayOfBirth": "24",
                                    "monthOfBirth": "11",
                                    "yearOfBirth": "1998",
                                    "dateOfBirth": "24-11-1998",
                                    "gender": "M",
                                    "email": "hemant.bodhai@XXXX.com",
                                    "mobile": "89995*****",
                                    "abhaNumber": "91-3837-7464-XXXX",
                                    "address": "house no-620, main road, Nashik, Nashik, Maharashtra",
                                    "stateName": "MAHARASHTRA",
                                    "pinCode": "422003",
                                    "stateCode": "27",
                                    "districtCode": "487",
                                    "authMethods": [
                                        "AADHAAR_OTP",
                                        "MOBILE_OTP"
                                    ],
                                    "status": "ACTIVE",
                                    "subDistrictCode": "",
                                    "subDistrictName": "",
                                    "emailVerified": "false",
                                    "mobileVerified": "true",
                                    "kycStatus": "VERIFIED"

                                }
                            };
                        }


                        return await baseQuery({
                            url:
                                `${BASE_URL_API}${END_POINTS.profileByToken}`,

                            method: "GET",

                            headers: {
                                "X-token":
                                    params.json_web_token
                            }
                        });
                    },


                    async onQueryStarted(
                        arg,
                        {
                            queryFulfilled
                        }
                    ) {

                        console.log(
                            "========== ABHA PROFILE START =========="
                        );

                        try {

                            const result =
                                await queryFulfilled;

                            console.log(
                                "ABHA PROFILE RESPONSE =>",
                                JSON.stringify(
                                    result.data,
                                    null,
                                    2
                                )
                            );

                        } catch (error: any) {

                            showToast(
                                "error",
                                "ABHA Profile Failed",
                                getErrorMessage(error)
                            );

                            console.log(error);
                        }
                    }

                })
        })
    });


export const {
    useAbhaProfileQuery,
    useLazyAbhaProfileQuery
} = abhaProfileApi;



export const getAbhaProfilePayload = (
    token: string
): AbhaProfilePayload => ({
    json_web_token: token
});