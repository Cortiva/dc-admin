export interface TokenPayload {
    sub: string;
    iat?: number;
    exp?: number;
}

export interface AuthUser {
    email: string | null;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: "Bearer";
    user: AuthUser;
}

// Re-export as User for authSlice compatibility
export type User = AuthUser;
