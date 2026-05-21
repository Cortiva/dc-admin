// Permission type
export interface Permission {
    id: string;
    name: string;
    code: string;
    module: string | null;
    description: string;
}

// Role permission junction
export interface RolePermission {
    id: string;
    roleId: string;
    permissionId: string;
    permission: Permission;
}

// Role type
export interface Role {
    id: string;
    schoolId: string | null;
    name: string;
    code: string;
    description: string;
    isSystem: boolean;
    permissions: RolePermission[];
}

// User metadata
export interface UserMetadata {
    additionalProp1?: Record<string, unknown>;
    additionalProp2?: Record<string, unknown>;
    additionalProp3?: Record<string, unknown>;
}

// User type
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    phone: string;
    alternativePhone: string | null;
    gender: string;
    avatar: string | null;
    dateOfBirth: string;
    role: string;
    twoFactorEnabled: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    bioMetricEnabled: boolean;
    metadata: UserMetadata;
    requiresPasswordChange: boolean;
    lastLoginAt: string;
    createdAt: string;
}

// Login response
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}

// Refresh token response (if it follows same structure as login)
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}

// Auth state type for Redux
export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresIn: number | null;
    tokenType: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initial auth state
export const initialAuthState: AuthState = {
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    tokenType: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Helper type for setCredentials payload
export interface SetCredentialsPayload {
    token: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}
