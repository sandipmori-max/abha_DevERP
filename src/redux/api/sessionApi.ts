import { baseApi } from "./baseApi";

import {
    setSession,
} from "../slices/authSlice";
import { certificateApi } from "./certificateApi";
import { BASE_URL_PUBLIC_API, CLIENT_ID, CLIENT_SECERET, GRANT_TYPE, X_CM_ID } from "../../utils/helpers";
import { END_POINTS } from "./end_points";


export const sessionApi =
    baseApi.injectEndpoints({

        endpoints: (builder) => ({

            createSession:
                builder.mutation<any, void>({
                    query: () => ({
                        url:
                            `${BASE_URL_PUBLIC_API}${END_POINTS.sessions}`,
                        method: "POST",
                        headers: {
                            "X-CM-ID": X_CM_ID,
                        },
                        body: {
                            clientId: CLIENT_ID,
                            clientSecret: CLIENT_SECERET,
                            grantType: GRANT_TYPE,
                        },
                    }),
                    async onQueryStarted(
                        arg,
                        {
                            dispatch,
                            queryFulfilled,
                        }
                    ) {

                        try {

                            const {
                                data,
                            } =
                                await queryFulfilled;


                            dispatch(
                                setSession(data)
                            );
                            dispatch(
                                certificateApi.endpoints
                                    .getCertificate
                                    .initiate()
                            );

                        } catch (error) {

                            console.log(error);

                        }

                    },

                }),

        }),

    });


export const {
    useCreateSessionMutation,

} = sessionApi;