import { apiSlice } from "../../store/apiSlice";

// Define your request and response types
interface CheckEmailRequest {
    email: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
    // add other registration fields as needed
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RefreshTokenRequest {
    refreshToken: string;
}

interface LogoutRequest {
    refreshToken?: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

interface VerifyEmailRequest {
    token: string;
}

// Define response types (adjust based on your API)
interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: string;
        // add other user fields
    };
    accessToken: string;
    refreshToken: string;
}

interface MessageResponse {
    message: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        checkEmail: builder.mutation<MessageResponse, CheckEmailRequest>({
            query: (data: CheckEmailRequest) => ({
                url: `/auth/check-email`,
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (data: RegisterRequest) => ({
                url: `/auth/register`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (data: LoginRequest) => ({
                url: `/auth/login`,
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
            query: (data: RefreshTokenRequest) => ({
                url: `/auth/refresh-token`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation<MessageResponse, LogoutRequest>({
            query: (data: LogoutRequest) => ({
                url: `/auth/logout`,
                method: "POST",
                body: data,
            }),
        }),
        logoutAll: builder.mutation<MessageResponse, void>({
            query: () => ({
                url: `/auth/logout-all`,
                method: "POST",
            }),
        }),
        changePassword: builder.mutation<
            MessageResponse,
            ChangePasswordRequest
        >({
            query: (data: ChangePasswordRequest) => ({
                url: `/auth/change-password`,
                method: "PUT",
                body: data,
            }),
        }),
        forgotPassword: builder.mutation<
            MessageResponse,
            ForgotPasswordRequest
        >({
            query: (data: ForgotPasswordRequest) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        verifyEmail: builder.mutation<MessageResponse, VerifyEmailRequest>({
            query: (data: VerifyEmailRequest) => ({
                url: `/auth/verify-email`,
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
            query: (data: ResetPasswordRequest) => ({
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
