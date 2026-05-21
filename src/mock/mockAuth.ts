import { MOCK_USERS, otpStore } from "./auth";

const delay = (ms = 800) => new Promise((res) => setTimeout(res, ms));

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

// ─── Login ───────────────────────────────────────────────
export const mockLogin = async (email: string, password: string) => {
    await delay();
    const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password,
    );
    if (!user) throw new Error("Invalid email or password.");
    const { password: _, ...safeUser } = user;
    console.log("Mock login successful for:", safeUser, _);
    return { user: safeUser, token: `mock-token-${safeUser.id}` };
};

// ─── Step 1: Request OTP ─────────────────────────────────
export const mockForgotPassword = async (email: string) => {
    await delay();

    // Debug: Log what we're looking for
    console.log(`[Forgot Password] Looking for email: ${email}`);
    console.log(
        `[Forgot Password] Available emails:`,
        MOCK_USERS.map((u) => u.email),
    );

    // Make it case-insensitive
    const exists = MOCK_USERS.some(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!exists) {
        console.log(`Failed - Email ${email} not found in mock users`);
        throw new Error(
            `No account found with email "${email}". Available emails: ${MOCK_USERS.map((u) => u.email).join(", ")}`,
        );
    }

    const otp = generateOTP();
    otpStore[email.toLowerCase()] = {
        // Store in lowercase for consistency
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // expires in 5 mins
    };

    // In dev, log it so you can test without an email service
    console.info(`[MOCK OTP] ${email} → ${otp}`);

    return {
        message: `OTP sent to ${email}. Check your console for the mock code.`,
    };
};

// ─── Step 2: Verify OTP ──────────────────────────────────
export const mockVerifyOTP = async (email: string, otp: string) => {
    await delay();
    const record = otpStore[email];

    if (!record) throw new Error("No OTP requested for this email.");
    if (Date.now() > record.expiresAt) {
        delete otpStore[email];
        throw new Error("OTP has expired. Please request a new one.");
    }
    if (record.otp !== otp) throw new Error("Invalid OTP. Please try again.");

    return {
        message: "OTP verified.",
        resetToken: `reset-${email}-${Date.now()}`,
    };
};

// ─── Step 3: Reset Password ──────────────────────────────
export const mockResetPassword = async (
    email: string,
    resetToken: string,
    newPassword: string,
) => {
    await delay();

    // Validate token is legit (basic mock check)
    if (!resetToken.startsWith(`reset-${email}`)) {
        throw new Error("Invalid or expired reset token.");
    }

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) throw new Error("User not found.");

    // Mutate mock data (in-memory only)
    user.password = newPassword;
    delete otpStore[email];

    return { message: "Password reset successful. You can now log in." };
};
