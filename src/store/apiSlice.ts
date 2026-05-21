import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    FetchBaseQueryError,
    BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { User } from "../types/user";
import type { RootState } from "./store";
import {
    logout,
    selectCurrentAccessToken,
    setCredentials,
} from "../modules/auth/authSlice";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = selectCurrentAccessToken(state);

        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        headers.set("x-api-key", apiKey);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Check if error is 401 Unauthorized
    if (result.error?.status === 401) {
        const state = api.getState() as RootState;
        const refreshToken = state.auth?.refreshToken;

        if (refreshToken) {
            try {
                // Send refresh token to get new access token
                const refreshResult = await baseQuery(
                    {
                        url: "/auth/refresh-token",
                        method: "POST",
                        body: { refreshToken },
                    },
                    api,
                    extraOptions,
                );

                // Handle the nested response structure
                if (refreshResult.data) {
                    const responseData = refreshResult.data as {
                        data: {
                            user: User;
                            token: string;
                            refreshToken: string;
                            expiresIn: number;
                            tokenType: string;
                        };
                    };

                    // Extract tokens from the nested data property
                    const {
                        user,
                        token,
                        refreshToken: newRefreshToken,
                        expiresIn,
                        tokenType,
                    } = responseData.data;

                    // Store the new tokens
                    api.dispatch(
                        setCredentials({
                            token,
                            refreshToken: newRefreshToken,
                            user,
                            expiresIn,
                            tokenType,
                        }),
                    );

                    // Retry the original query with new access token
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    // Refresh failed - log out
                    api.dispatch(logout());
                }
            } catch (error) {
                console.error("Refresh token error:", error);
                api.dispatch(logout());
            }
        } else {
            // No refresh token available - log out
            api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
    tagTypes: [], // Add any tag types you use for caching
});
