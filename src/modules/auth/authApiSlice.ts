import { apiSlice } from "../../store/apiSlice";

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

// Define response types (adjust based on your API)
interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
    };
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

interface AcceptInviteRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

interface MessageResponse {
    message: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (data: RegisterRequest) => ({
                url: `/auth/register`,
                method: "POST",
                body: data,
            }),
        }),
        selfRegister: builder.mutation<AuthResponse, SelfRegisterRequest>({
            query: (data: SelfRegisterRequest) => ({
                url: `/auth/self-register`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data: LoginRequest) => ({
                url: `/auth/login`,
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
            query: (data: RefreshTokenRequest) => ({
                url: `/auth/refresh`,
                method: "POST",
                body: data,
            }),
        }),
        acceptInvite: builder.mutation<MessageResponse, AcceptInviteRequest>({
            query: (data: AcceptInviteRequest) => ({
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
            query: (data: ChangePasswordRequest) => ({
                url: `/auth/change-password`,
                method: "PUT",
                body: data,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data: ForgotPasswordRequest) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        verifyEmail: builder.mutation({
            query: (data: VerifyEmailRequest) => ({
                url: `/auth/verify-forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data: ResetPasswordRequest) => ({
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
