import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { generateGUID } from "../../utils/helpers";

export const baseApi =
  createApi({
    reducerPath: "baseApi",

    baseQuery: fetchBaseQuery({
      // baseUrl: BASE_URL_PUBLIC_API,

      prepareHeaders: (
        headers,
        { getState }
      ) => {
        console.log(
          "========== PREPARE HEADERS =========="
        );

        const state =
          getState() as any;

        console.log(
          "Redux State =>",
          JSON.stringify(
            state,
            null,
            2
          )
        );

        const token =
          state?.auth
            ?.accessToken;

        console.log(
          "Access Token Exists =>",
          !!token
        );

        console.log(
          "Access Token =>",
          token
        );

        if (token) {
          headers.set(
            "Authorization",
            `Bearer ${token}`
          );

          console.log(
            "Authorization Header Added"
          );
        } else {
          console.log(
            "No Access Token Found"
          );
        }

        const requestId =
          generateGUID();

        console.log(
          "REQUEST-ID =>",
          requestId
        );

        headers.set(
          "REQUEST-ID",
          requestId
        );

        const timestamp =
          new Date()
            .toISOString();

        console.log(
          "TIMESTAMP =>",
          timestamp
        );

        headers.set(
          "TIMESTAMP",
          timestamp
        );

        headers.set(
          "Content-Type",
          "application/json"
        );

        console.log(
          "Final Headers =>",
          {
            Authorization:
              token
                ? `Bearer ${token}`
                : undefined,
            "REQUEST-ID":
              requestId,
            TIMESTAMP:
              timestamp,
            "Content-Type":
              "application/json",
          }
        );

        console.log(
          "========== HEADERS READY =========="
        );

        return headers;
      },
    }),

    endpoints: () => ({}),
  });