import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { generateGUID } from "../../utils/helpers";

export const baseApi =
    createApi({
        reducerPath: "baseApi",
        baseQuery:
            fetchBaseQuery({
                prepareHeaders: (
                    headers,
                    { getState }
                ) => {
                    const token =
                        getState()
                            .auth
                            ?.accessToken;
                    if (token) {
                        headers.set(
                            "Authorization",
                            `Bearer ${token}`
                        );
                    }
                    headers.set(
                        "REQUEST-ID",
                        generateGUID()
                    );
                    headers.set(
                        "TIMESTAMP",
                        new Date()
                            .toISOString()
                    );
                    headers.set(
                        "Content-Type",
                        "application/json"
                    );
                    return headers;
                },
            }),
        endpoints: () => ({}),
    });