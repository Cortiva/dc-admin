import { apiSlice } from "../../store/apiSlice";
import type { AuthUser } from "../../types/auth.types";

interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "SUPER_ADMIN" | "ADMIN" | "USER";
}

interface SelfRegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RefreshTokenRequest {
    refreshToken: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
}

interface VerifyEmailRequest {
    email: string;
    otp: string;
}

interface AcceptInviteRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

interface MessageResponse {
    message: string;
}

// The actual payload the backend sends back for auth endpoints.
interface AuthPayload {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

// The backend wraps every payload in a `data` envelope — LoginPage.tsx
// destructures `result.data`, so the response type needs to reflect that
// wrapper instead of putting the fields at the top level. Previously
// AuthResponse had no `data` field at all, which meant `result.data` in
// LoginPage only worked by accident (because `login` had no generics, so
// nothing was type-checked).
interface AuthResponse {
    data: AuthPayload;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (data) => ({
                url: `/auth/register`,
                method: "POST",
                body: data,
            }),
        }),
        selfRegister: builder.mutation<AuthResponse, SelfRegisterRequest>({
            query: (data) => ({
                url: `/auth/self-register`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (data) => ({
                url: `/auth/login`,
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
            query: (data) => ({
                url: `/auth/refresh`,
                method: "POST",
                body: data,
            }),
        }),
        acceptInvite: builder.mutation<MessageResponse, AcceptInviteRequest>({
            query: (data) => ({
                url: `/auth/accept-invite`,
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
            query: (data) => ({
                url: `/auth/change-password`,
                method: "PUT",
                body: data,
            }),
        }),
        forgotPassword: builder.mutation<
            MessageResponse,
            ForgotPasswordRequest
        >({
            query: (data) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        verifyEmail: builder.mutation<MessageResponse, VerifyEmailRequest>({
            query: (data) => ({
                url: `/auth/verify-forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: `/auth/reset-password`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useSelfRegisterMutation,
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useAcceptInviteMutation,
    useLogoutAllMutation,
    useChangePasswordMutation,
    useVerifyEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApiSlice;
