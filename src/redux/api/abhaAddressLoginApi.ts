import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";

import { showToast } from "../../utils/toast";
import { setTxnId } from "../slices/abhaSlice";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";


const MOCK_ABHA_ADDRESS_REQUEST_OTP = false;


export interface AbhaAddressRequestOtpPayload {

  scope: string[];
  loginHint: string;
  loginId: string;
  otpSystem: string; 

}



export const abhaAddressLoginApi =
  baseApi.injectEndpoints({

    endpoints: (builder) => ({


      abhaAddressRequestOtp:

        builder.mutation<
          any,
          AbhaAddressRequestOtpPayload
        >({

          async queryFn(
            body,
            _api,
            _extraOptions,
            baseQuery
          ) {


            console.log(
              "========== ABHA ADDRESS REQUEST OTP =========="
            );


            console.log(
              "Request URL =>",
              END_POINTS.abhaAddressRequestOtp
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

            if(
              MOCK_ABHA_ADDRESS_REQUEST_OTP
            ) {


              console.log(
                "========== MOCK ABHA ADDRESS OTP RESPONSE =========="
              );


              return {

                data: {

                  txnId:
                    "c529c3f6-41fa-4c79-980a-fc42390b44ee",

                  message:
                    "OTP sent successfully"

                }

              };


            }



            // ACTUAL API

            return await baseQuery({

              url:
                `${BASE_URL_API}${END_POINTS.abhaAddressRequestOtp}`,

              method:
                "POST",

              body,

            });


          },



          async onQueryStarted(
            arg,
            {
              dispatch,
              queryFulfilled,
            }
          ) {


            console.log(
              "========== ABHA ADDRESS OTP onQueryStarted =========="
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
                "Response =>",
                JSON.stringify(
                  result,
                  null,
                  2
                )
              );



              const {
                data
              } = result;



              if(
                data?.txnId
              ) {


                dispatch(
                  setTxnId(
                    data.txnId
                  )
                );


                console.log(
                  "txnId saved =>",
                  data.txnId
                );

              }



            } catch(error:any) {


              showToast(
                "error",
                "ABHA Address OTP Failed",
                getErrorMessage(error)
              );


              console.log(
                "========== ABHA ADDRESS OTP ERROR =========="
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

  useAbhaAddressRequestOtpMutation,

} = abhaAddressLoginApi;