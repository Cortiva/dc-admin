import {
    createApi,
    fetchBaseQuery,
    type FetchBaseQueryError,
    type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import {
    logout,
    selectCurrentAccessToken,
    setCredentials,
} from "../modules/auth/authSlice";
import type { AuthUser } from "../types/auth.types";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
const apiKey = import.meta.env.VITE_API_KEY as string;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = selectCurrentAccessToken(getState() as RootState);
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        headers.set("x-api-key", apiKey);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

interface RefreshResponse {
    data: {
        user: AuthUser;
        token: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
    };
}

const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const refreshToken = (api.getState() as RootState).auth?.refreshToken;

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: "/auth/refresh",
                    method: "POST",
                    body: { refreshToken },
                },
                api,
                extraOptions,
            );

            if (refreshResult.data) {
                const {
                    user,
                    token,
                    refreshToken: newRefreshToken,
                    expiresIn,
                    tokenType,
                } = (refreshResult.data as RefreshResponse).data;

                api.dispatch(
                    setCredentials({
                        token,
                        refreshToken: newRefreshToken,
                        user,
                        expiresIn,
                        tokenType,
                    }),
                );
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
    tagTypes: [
        "Users",
        "Areas",
        "Zones",
        "Cells",
        "Visitors",
        "VisitorMetrics",
        "Dashboard",
        "Members",
        "Departments",
    ],
});
