import { apiSlice } from "../../store/apiSlice";
import type {
    AuthUser,
    ValidateMemberNumberResponse,
} from "../../types/auth.types";

// ─── Request Types ──────────────────────────────────────────────────────────

interface SelfRegisterRequest {
    memberNumber: string;
    password: string;
    confirmPassword: string;
    email?: string;
    phone?: string;
}

interface ValidateMemberNumberRequest {
    memberNumber: string;
}

interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
    deviceInfo?: {
        deviceId?: string;
        deviceType?: "web" | "mobile" | "tablet";
        userAgent?: string;
        ipAddress?: string;
        platform?: "ios" | "android" | "web";
    };
}

interface RefreshTokenRequest {
    refreshToken: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    email: string;
    otp: string;
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

interface ResendOtpRequest {
    email: string;
    purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
}

interface LogoutRequest {
    refreshToken?: string;
}

interface MessageResponse {
    message: string;
    success: boolean;
}

// ─── Response Types ─────────────────────────────────────────────────────────

interface AuthPayload {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

interface AuthResponse {
    data: AuthPayload;
}

interface OtpSentResponse {
    message: string;
    email: string;
    resendAfter?: number;
    success: boolean;
}

interface SessionResponse {
    id: string;
    userId: string;
    deviceInfo: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

// ─── API Slice ──────────────────────────────────────────────────────────────

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── Member Number Validation ──────────────────────────────────────

        validateMemberNumber: builder.mutation<
            ValidateMemberNumberResponse,
            ValidateMemberNumberRequest
        >({
            query: (data) => ({
                url: `/auth/validate-member`,
                method: "POST",
                body: data,
            }),
        }),

        // ─── Self Register ──────────────────────────────────────────────────

        selfRegister: builder.mutation<AuthResponse, SelfRegisterRequest>({
            query: (data) => ({
                url: `/auth/self-register`,
                method: "POST",
                body: data,
            }),
        }),

        // ─── Login ─────────────────────────────────────────────────────────

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (data) => ({
                url: `/auth/login`,
                method: "POST",
                body: data,
            }),
        }),

        // ─── Refresh Token ─────────────────────────────────────────────────

        refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
            query: (data) => ({
                url: `/auth/refresh`,
                method: "POST",
                body: data,
            }),
        }),

        // ─── Logout ─────────────────────────────────────────────────────────

        logout: builder.mutation<MessageResponse, LogoutRequest>({
            query: (data) => ({
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

        // ─── Sessions ──────────────────────────────────────────────────────

        getSessions: builder.query<SessionResponse[], void>({
            query: () => ({
                url: `/auth/sessions`,
                method: "GET",
            }),
        }),

        revokeSession: builder.mutation<MessageResponse, string>({
            query: (sessionId) => ({
                url: `/auth/sessions/${sessionId}`,
                method: "DELETE",
            }),
        }),

        // ─── Account Verification ──────────────────────────────────────────

        verifyEmail: builder.mutation<MessageResponse, VerifyEmailRequest>({
            query: (data) => ({
                url: `/auth/verify`,
                method: "POST",
                body: data,
            }),
        }),

        resendOtp: builder.mutation<OtpSentResponse, ResendOtpRequest>({
            query: (data) => ({
                url: `/auth/resend-otp`,
                method: "POST",
                body: data,
            }),
        }),

        // ─── Password Management ───────────────────────────────────────────

        forgotPassword: builder.mutation<
            OtpSentResponse,
            ForgotPasswordRequest
        >({
            query: (data) => ({
                url: `/auth/forgot-password`,
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

        changePassword: builder.mutation<
            MessageResponse,
            ChangePasswordRequest
        >({
            query: (data) => ({
                url: `/auth/change-password`,
                method: "POST",
                body: data,
            }),
        }),

        // ─── Invitations ────────────────────────────────────────────────────

        acceptInvite: builder.mutation<MessageResponse, AcceptInviteRequest>({
            query: (data) => ({
                url: `/auth/accept-invite`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

// ─── Exports ────────────────────────────────────────────────────────────────

export const {
    useValidateMemberNumberMutation,
    useSelfRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useGetSessionsQuery,
    useRevokeSessionMutation,
    useVerifyEmailMutation,
    useResendOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useAcceptInviteMutation,
} = authApiSlice;
