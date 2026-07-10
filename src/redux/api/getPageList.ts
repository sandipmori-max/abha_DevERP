import { BASE_URL_API, getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { RootState } from "../store";

const MOCK_GET_PAGE_LIST = false;

export interface GetPageListPayload {
    token: string;
    page: string;
    fd: string,
    td: string,
    param: string,
    branch: string
}

export const getPageListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPageList: builder.mutation<any[], GetPageListPayload>({
            async queryFn(
                body,
                api,
                _extraOptions,
                baseQuery
            ) {
                console.log(
                    "========== GET PAGE LIST =========="
                );

                console.log(
                    "Request URL => /getListData"
                );

                console.log(
                    "Request Method => POST"
                );

                console.log(
                    "Request Body =>",
                    JSON.stringify(body, null, 2)
                );

                // ================= MOCK RESPONSE =================
                if (MOCK_GET_PAGE_LIST) {
                    console.log(
                        "========== MOCK PAGE LIST RESPONSE =========="
                    );

                    return {
                        data: [
                            { message: "Account created successfully", txnId: "TXN001", tokens: { token: "token_001", expiresIn: 1800, refreshToken: "refresh_001", refreshExpiresIn: 1296000, }, ABHANumber: "91-1234-5678-0001", preferredAbhaAddress: "rahul01@abdm", mobile: "******1001", firstName: "Rahul", middleName: "Kumar", lastName: "Sharma", name: "Rahul Kumar Sharma", dob: "15-03-1995", yearOfBirth: "1995", dayOfBirth: "15", monthOfBirth: "03", gender: "M", profilePhoto: "https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", address: "Ahmedabad, Gujarat", stateName: "GUJARAT", districtName: "AHMEDABAD", status: "ACTIVE", createdDate: "01-07-2026", isNew: true, }, { message: "Profile fetched successfully", txnId: "TXN002", tokens: { token: "token_002", expiresIn: 1800, refreshToken: "refresh_002", refreshExpiresIn: 1296000, }, ABHANumber: "91-1234-5678-0002", preferredAbhaAddress: "priya02@abdm", mobile: "******1002", firstName: "Priya", middleName: "", lastName: "Patel", name: "Priya Patel", dob: "21-09-1998", yearOfBirth: "1998", dayOfBirth: "21", monthOfBirth: "09", gender: "F", profilePhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", address: "Surat, Gujarat", stateName: "GUJARAT", districtName: "SURAT", status: "ACTIVE", createdDate: "02-07-2026", isNew: false, }, { message: "Profile fetched successfully", txnId: "TXN003", tokens: { token: "token_003", expiresIn: 1800, refreshToken: "refresh_003", refreshExpiresIn: 1296000, }, ABHANumber: "91-1234-5678-0003", preferredAbhaAddress: "amit03@abdm", mobile: "******1003", firstName: "Amit", middleName: "", lastName: "Verma", name: "Amit Verma", dob: "10-12-1992", yearOfBirth: "1992", dayOfBirth: "10", monthOfBirth: "12", gender: "M", profilePhoto: "https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", address: "Vadodara, Gujarat", stateName: "GUJARAT", districtName: "VADODARA", status: "ACTIVE", createdDate: "03-07-2026", isNew: false, }, { message: "Profile fetched successfully", txnId: "TXN004", tokens: { token: "token_004", expiresIn: 1800, refreshToken: "refresh_004", refreshExpiresIn: 1296000, }, ABHANumber: "91-1234-5678-0004", preferredAbhaAddress: "neha04@abdm", mobile: "******1004", firstName: "Neha", middleName: "", lastName: "Joshi", name: "Neha Joshi", dob: "08-05-1997", yearOfBirth: "1997", dayOfBirth: "08", monthOfBirth: "05", gender: "F", profilePhoto: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", address: "Rajkot, Gujarat", stateName: "GUJARAT", districtName: "RAJKOT", status: "ACTIVE", createdDate: "04-07-2026", isNew: true, }, { message: "Profile fetched successfully", txnId: "TXN005", tokens: { token: "token_005", expiresIn: 1800, refreshToken: "refresh_005", refreshExpiresIn: 1296000, }, ABHANumber: "91-1234-5678-0005", preferredAbhaAddress: "karan05@abdm", mobile: "******1005", firstName: "Karan", middleName: "", lastName: "Mehta", name: "Karan Mehta", dob: "30-11-1990", yearOfBirth: "1990", dayOfBirth: "30", monthOfBirth: "11", gender: "M", profilePhoto: "https://plus.unsplash.com/premium_photo-1739786996060-2769f1ded135?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", address: "Bhavnagar, Gujarat", stateName: "GUJARAT", districtName: "BHAVNAGAR", status: "INACTIVE", createdDate: "05-07-2026", isNew: false, },
                        ],
                    };
                }

                // ================= ACTUAL API =================
                const state = api.getState() as RootState;
                const baseUrl = state.abha.devERPBaseUrl;

                return await baseQuery({
                    url: `${baseUrl}/getListData`,
                    method: "POST",
                    body,
                });
            },

            async onQueryStarted(
                arg,
                {
                    dispatch,
                    queryFulfilled }
            ) {
                console.log(
                    "========== GET PAGE LIST onQueryStarted =========="
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
                } catch (error: any) {
                    showToast(
                        "error",
                        "Get Page List Failed",
                        getErrorMessage(error)
                    );

                    console.log(
                        "========== GET PAGE LIST ERROR =========="
                    );

                    console.log(error);
                }
            },
        }),
    }),
});

export const getPageListPayload = (
    token: string,
    page: string,
    fd: string,
    td: string,
    param: string,
    branch: string,
): GetPageListPayload => ({
    token,
    page,
    fd,
    td,
    param,
    branch
});

export const {
    useGetPageListMutation,
} = getPageListApi;