import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { encryptData, decryptData } from "../../utils/pCrypto";
import type { RootState } from "../../store/rootReducer";
import type { AuthUser } from "../../types/auth.types";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    expiresIn: number | null;
    tokenType: string | null;
    isHydrated: boolean;
}

// Cookie keys
const COOKIE_KEYS = {
    accessToken: "dcToken",
    refreshToken: "dcRefreshToken",
    user: "dcUser",
    expiresIn: "dcExpiresIn",
    tokenType: "dcTokenType",
} as const;

const ALL_COOKIE_KEYS = Object.values(COOKIE_KEYS);

// Reads + decrypts a cookie
const getDecryptedCookie = (key: string): string | null => {
    const cookie = Cookies.get(key);
    if (!cookie) return null;

    try {
        const decrypted = decryptData(cookie);
        return typeof decrypted === "string"
            ? decrypted
            : JSON.stringify(decrypted);
    } catch (error) {
        console.error(`Failed to decrypt cookie "${key}":`, error);
        return null;
    }
};

// Reads + decrypts + parses the user cookie
const getDecryptedUser = (): AuthUser | null => {
    const raw = getDecryptedCookie(COOKIE_KEYS.user);
    if (!raw) return null;

    try {
        const user = JSON.parse(raw) as AuthUser;
        if (!user.memberNumber) {
            user.memberNumber = "";
        }
        return user;
    } catch (error) {
        console.error("Failed to parse user cookie:", error);
        return null;
    }
};

// Writes a cookie as ciphertext
const setEncryptedCookie = (
    key: string,
    value: string,
    options: Cookies.CookieAttributes,
): void => {
    try {
        Cookies.set(key, encryptData(value), options);
    } catch (error) {
        console.error(`Failed to set cookie "${key}":`, error);
    }
};

const buildCookieOptions = (expiresIn?: number): Cookies.CookieAttributes => ({
    secure: true,
    sameSite: "strict",
    expires: expiresIn ? new Date(Date.now() + expiresIn * 1000) : 7,
});

const storedToken = getDecryptedCookie(COOKIE_KEYS.accessToken);
const storedRefreshToken = getDecryptedCookie(COOKIE_KEYS.refreshToken);
const storedExpiresIn = getDecryptedCookie(COOKIE_KEYS.expiresIn);
const storedTokenType = getDecryptedCookie(COOKIE_KEYS.tokenType);
const storedUser = getDecryptedUser();

const initialState: AuthState = {
    accessToken: storedToken,
    refreshToken: storedRefreshToken,
    user: storedUser,
    expiresIn: storedExpiresIn ? Number(storedExpiresIn) : null,
    tokenType: storedTokenType,
    isHydrated: true,
};

interface SetCredentialsPayload {
    token: string;
    refreshToken: string;
    user: AuthUser;
    expiresIn: number;
    tokenType: string;
}

interface SetUserDataPayload {
    user: AuthUser;
}

interface UpdateAccessTokenPayload {
    token: string;
    expiresIn: number;
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<SetCredentialsPayload>,
        ) => {
            const { token, refreshToken, user, expiresIn, tokenType } =
                action.payload;

            state.accessToken = token;
            state.refreshToken = refreshToken;
            state.user = user;
            state.expiresIn = expiresIn;
            state.tokenType = tokenType;

            if (!token) return;

            const cookieOptions = buildCookieOptions(expiresIn);

            setEncryptedCookie(COOKIE_KEYS.accessToken, token, cookieOptions);
            setEncryptedCookie(
                COOKIE_KEYS.refreshToken,
                refreshToken,
                cookieOptions,
            );
            setEncryptedCookie(
                COOKIE_KEYS.user,
                JSON.stringify(user),
                cookieOptions,
            );
            setEncryptedCookie(
                COOKIE_KEYS.expiresIn,
                String(expiresIn),
                cookieOptions,
            );
            setEncryptedCookie(COOKIE_KEYS.tokenType, tokenType, cookieOptions);
        },

        setUserData: (state, action: PayloadAction<SetUserDataPayload>) => {
            const { user } = action.payload;
            if (!user) return;

            state.user = user;
            const cookieOptions = buildCookieOptions(
                state.expiresIn ?? undefined,
            );
            setEncryptedCookie(
                COOKIE_KEYS.user,
                JSON.stringify(user),
                cookieOptions,
            );
        },

        updateAccessToken: (
            state,
            action: PayloadAction<UpdateAccessTokenPayload>,
        ) => {
            const { token, expiresIn } = action.payload;
            state.accessToken = token;
            state.expiresIn = expiresIn;

            const cookieOptions = buildCookieOptions(expiresIn);
            setEncryptedCookie(COOKIE_KEYS.accessToken, token, cookieOptions);
            setEncryptedCookie(
                COOKIE_KEYS.expiresIn,
                String(expiresIn),
                cookieOptions,
            );
        },

        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.expiresIn = null;
            state.tokenType = null;

            ALL_COOKIE_KEYS.forEach((cookie) => {
                Cookies.remove(cookie, { path: "/" });
            });

            localStorage.removeItem("tempEmail");
            sessionStorage.clear();
        },

        setHydrated: (state) => {
            state.isHydrated = true;
        },
    },
});

export const {
    setCredentials,
    setUserData,
    updateAccessToken,
    logout,
    setHydrated,
} = authSlice.actions;

export const selectCurrentAccessToken = (state: RootState): string | null =>
    state.auth.accessToken;
export const selectCurrentRefreshToken = (state: RootState): string | null =>
    state.auth.refreshToken;
export const selectCurrentUser = (state: RootState): AuthUser | null =>
    state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean =>
    !!state.auth.accessToken;
export const selectAuthTokenType = (state: RootState): string | null =>
    state.auth.tokenType;
export const selectTokenExpiry = (state: RootState): number | null =>
    state.auth.expiresIn;
export const selectIsHydrated = (state: RootState): boolean =>
    state.auth.isHydrated;
export const selectMemberNumber = (state: RootState): string | null =>
    state.auth.user?.memberNumber || null;

export default authSlice.reducer;
