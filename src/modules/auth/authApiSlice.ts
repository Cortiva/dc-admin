import { apiSlice } from "../../store/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        checkEmail: builder.mutation({
            query: (data) => ({
                url: `/auth/check-email`,
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `/auth/register`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `/auth/login`,
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation({
            query: (data) => ({
                url: `/auth/refresh-token`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: `/auth/logout`,
                method: "POST",
                body: data,
            }),
        }),
        logoutAll: builder.mutation({
            query: (data) => ({
                url: `/auth/logout-all`,
                method: "POST",
                body: data,
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: `/auth/change-password`,
                method: "PUT",
                body: data,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: `/auth/verify-email`,
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: `/auth/reset-password`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useCheckEmailMutation,
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useChangePasswordMutation,
    useVerifyEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApiSlice;
