import {
    BASE_URL_API,
    getErrorMessage,
} from "../../utils/helpers";

import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";


const MOCK_ABHA_ADDRESS_VERIFY_OTP = true;



export interface AbhaAddressVerifyOtpPayload {

    scope: string[];

    authData: {

        authMethods: string[];

        otp: {

            txnId: string;

            otpValue: string;

        };

    };

}



export const abhaAddressVerifyApi =
    baseApi.injectEndpoints({

        endpoints: (builder) => ({


            abhaAddressVerifyOtp:

                builder.mutation<
                    any,
                    AbhaAddressVerifyOtpPayload
                >({


                    async queryFn(
                        body,
                        _api,
                        _extraOptions,
                        baseQuery
                    ) {


                        console.log(
                            "========== ABHA ADDRESS VERIFY OTP =========="
                        );


                        console.log(
                            "Request URL =>",
                            END_POINTS.abhaAddressVerifyOtp
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
                            MOCK_ABHA_ADDRESS_VERIFY_OTP
                        ) {


                            console.log(
                                "========== MOCK ABHA ADDRESS VERIFY RESPONSE =========="
                            );


                            return {

                                data: {
                                    "message": "OTP verified successfully",
                                    "authResult": "success",
                                    "users": [
                                        {
                                            "abhaAddress": "singh128@sbx",
                                            "fullName": "Deepak Kumar Singh",
                                            "profilePhoto": "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",
                                            "abhaNumber": "91-6167-8028-XXXX",
                                            "status": "ACTIVE",
                                            "kycStatus": "VERIFIED"
                                        }
                                    ],
                                    "tokens": {
                                        "token": "{{json_web_token}}g4ub9PC0i6QqLuBhGTlQGiSEGGbRvayEfykAdaA0TE2CQ6MiJmFK5XM1CdolZa8m8iBq56i70CrzfkP4-QRBwDgPOj8N9uNxnl1OBiLT9FqFVfcqfKtYDZqZ5wwU2qedFeVIzf08BTix7ceOuyWs8zFeMnOIC_FYL5bcfzBByIBv1mqGDjSaFIQaAC5i-ckx9AV-4ni0--2Eq3EdghY_EKdZvBkwskBB084iJz6ptp5lrIaEhkXaKuFs",
                                        "expiresIn": 1800,
                                        "refreshToken": "{{json_web_token}}c0_9hzoAyj0TZTcW1_rh6yuZqo8pvR_PN40SY6B9FhyxwbbgoDUXqcAxT2J5VtOyrZpAzkzto9sKdJKA1VEEaPh31s-GfOKPTLkhwG4_bMieCgdPXEbt3oFbcmPzgTIX9NYDWosgvmJVbUAjoz8Hb9ibqsppU-cl68ZReRAaRmKmYwajJ6E5dkU5qCsnTXiTpMJNNWpBBaqdHicM",
                                        "refreshExpiresIn": 1296000
                                    }
                                }

                            };


                        }



                        // ACTUAL API

                        return await baseQuery({

                            url:
                                `${BASE_URL_API}${END_POINTS.abhaAddressVerifyOtp}`,

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


                        console.log(
                            "========== ABHA ADDRESS VERIFY onQueryStarted =========="
                        );


                        console.log(
                            "Request Argument =>",
                            JSON.stringify(
                                arg,
                                null,
                                2
                            )
                        );



                        try {


                            const result =
                                await queryFulfilled;



                            console.log(
                                "========== ABHA VERIFY RESPONSE =========="
                            );


                            console.log(
                                JSON.stringify(
                                    result.data,
                                    null,
                                    2
                                )
                            );



                        } catch (error: any) {


                            showToast(
                                "error",
                                "ABHA Address Verify Failed",
                                getErrorMessage(error)
                            );


                            console.log(
                                "========== ABHA VERIFY ERROR =========="
                            );


                            console.log(
                                error
                            );


                        }


                    },


                }),


        }),


    });



export const {

    useAbhaAddressVerifyOtpMutation,

} = abhaAddressVerifyApi;