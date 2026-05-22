import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { encryptData, decryptData } from "../../utils/pCrypto";
import type { User } from "../../types/user";
import type { RootState } from "../../store/rootReducer";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    expiresIn: number | null;
    tokenType: string | null;
    isHydrated: boolean;
}

// Helper function to safely decrypt cookie data
const getDecryptedCookie = (key: string): string | null => {
    const cookie = Cookies.get(key);

    if (!cookie) {
        console.log(`No cookie found for ${key}`);
        return null;
    }

    try {
        const decrypted = decryptData(cookie);
        return typeof decrypted === "string"
            ? decrypted
            : JSON.stringify(decrypted);
    } catch (error) {
        console.error(`Failed to decrypt cookie ${key}:`, error);
        return null;
    }
};

// Helper function to safely parse user data
const getDecryptedUser = (): User | null => {
    const userCookie = Cookies.get("vUser");

    if (!userCookie) {
        console.log("No user cookie found");
        return null;
    }

    try {
        const decrypted = decryptData(userCookie);

        let userData: User;
        if (typeof decrypted === "string") {
            userData = JSON.parse(decrypted) as User;
        } else {
            userData = decrypted as User;
        }

        return userData;
    } catch (error) {
        console.error("Failed to decrypt user cookie:", error);
        return null;
    }
};

const storedToken = getDecryptedCookie("vToken");
const storedRefreshToken = getDecryptedCookie("vRefreshToken");
const storedExpiresIn = getDecryptedCookie("vExpiresIn");
const storedTokenType = getDecryptedCookie("vTokenType");
const storedUser = getDecryptedUser();

const initialState: AuthState = {
    accessToken: storedToken || null,
    refreshToken: storedRefreshToken || null,
    user: storedUser || null,
    expiresIn: storedExpiresIn ? Number(storedExpiresIn) : null,
    tokenType: storedTokenType || null,
    isHydrated: true,
};

// Payload types
interface SetCredentialsPayload {
    token: string;
    refreshToken: string;
    user: User;
    expiresIn: number;
    tokenType: string;
}

interface SetUserDataPayload {
    user: User;
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

            // Only set cookies if token exists
            if (token) {
                try {
                    // Create minimal user object for cookie storage
                    const minimalUser = {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        middleName: user.middleName,
                        phone: user.phone,
                        alternativePhone: user.alternativePhone,
                        gender: user.gender,
                        dateOfBirth: user.dateOfBirth,
                        role: user.role,
                        emailVerified: user.emailVerified,
                        requiresPasswordChange: user.requiresPasswordChange,
                    };

                    console.log(
                        "Minimal user size:",
                        JSON.stringify(minimalUser).length,
                        "bytes",
                    );

                    const cookieOptions = {
                        secure: true,
                        sameSite: "strict" as const,
                        expires: new Date(Date.now() + expiresIn * 1000),
                    };

                    Cookies.set("vToken", encryptData(token), cookieOptions);
                    Cookies.set(
                        "vRefreshToken",
                        encryptData(refreshToken),
                        cookieOptions,
                    );
                    Cookies.set(
                        "vUser",
                        encryptData(JSON.stringify(minimalUser)),
                        cookieOptions,
                    );
                    Cookies.set(
                        "vExpiresIn",
                        encryptData(String(expiresIn)),
                        cookieOptions,
                    );
                    Cookies.set(
                        "vTokenType",
                        encryptData(tokenType),
                        cookieOptions,
                    );
                } catch (error) {
                    console.error("Failed to set auth cookies:", error);
                }
            }
        },

        setUserData: (state, action: PayloadAction<SetUserDataPayload>) => {
            const { user } = action.payload;
            if (user) {
                state.user = user;
                try {
                    const cookieOptions = {
                        secure: true,
                        sameSite: "strict" as const,
                        expires: 7,
                    };
                    Cookies.set(
                        "vUser",
                        encryptData(JSON.stringify(user)),
                        cookieOptions,
                    );
                } catch (error) {
                    console.error("Failed to update user cookie:", error);
                }
            }
        },

        updateAccessToken: (
            state,
            action: PayloadAction<{ token: string; expiresIn: number }>,
        ) => {
            state.accessToken = action.payload.token;
            state.expiresIn = action.payload.expiresIn;
            try {
                Cookies.set("vToken", encryptData(action.payload.token), {
                    secure: true,
                    sameSite: "strict" as const,
                });
                Cookies.set(
                    "vExpiresIn",
                    encryptData(String(action.payload.expiresIn)),
                    { secure: true, sameSite: "strict" as const },
                );
            } catch (error) {
                console.error("Failed to update access token cookie:", error);
            }
        },

        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.expiresIn = null;
            state.tokenType = null;

            // Clear all auth cookies
            const cookiesToRemove = [
                "vToken",
                "vRefreshToken",
                "vUser",
                "vExpiresIn",
                "vTokenType",
            ];
            cookiesToRemove.forEach((cookie) => {
                Cookies.remove(cookie, { path: "/" });
            });

            // Clear any other auth-related storage
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

// Selectors - Fixed with proper typing (state is already typed as RootState)
export const selectCurrentAccessToken = (state: RootState): string | null =>
    state.auth.accessToken;
export const selectCurrentRefreshToken = (state: RootState): string | null =>
    state.auth.refreshToken;
export const selectCurrentUser = (state: RootState): User | null =>
    state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean =>
    !!state.auth.accessToken;
export const selectAuthTokenType = (state: RootState): string | null =>
    state.auth.tokenType;
export const selectTokenExpiry = (state: RootState): number | null =>
    state.auth.expiresIn;

export default authSlice.reducer;
