import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from '../../utils/functions';
import { mockResetPassword } from '../../mock/mockAuth'; // 👈 swap when API ready
import { Button } from '../../components/ui/button';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

// const [resetPassword] = useResetPasswordMutation(); // 👈 uncomment when API ready
const IS_MOCK = true; // 👈 flip to false when API is ready

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    // Pull both tokens set during OTP verification
    const email = localStorage.getItem("tempEmail") || "";
    const resetToken = localStorage.getItem("resetToken") || "";

    // Password strength logic
    const getStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = getStrength(password);
    const strengthLabel = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strength];
    const strengthColor = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-emerald-600",
    ][strength];

    const passwordsMatch = password === confirmPassword;
    const isValid = strength >= 3 && password.length >= 8 && passwordsMatch && !!confirmPassword;

    const handleResetPassword = async () => {
        if (!email || !resetToken) {
            toast.error("Session expired. Please start over.");
            navigate("/forgot-password");
            return;
        }

        try {
            setIsProcessing(true);

            let result;

            if (IS_MOCK) {
                result = await mockResetPassword(email, resetToken, password);
            } else {
                // const res = await resetPassword({
                //     token: resetToken,
                //     newPassword: password,
                //     confirmPassword,
                // }).unwrap();
                // result = res;
            }

            // Clean up all temp auth keys
            localStorage.removeItem("tempEmail");
            localStorage.removeItem("tmpTkn");
            localStorage.removeItem("resetToken");

            toast.success(result!.message);
            navigate("/login");
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <KeyRound className="h-7 w-7 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold font-heading">Set New Password</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Almost there. Choose a strong password you'll remember.
                </p>
            </div>

            <div className="space-y-5">
                {/* New Password */}
                <div className="space-y-3">
                    <Label htmlFor="password">New Password</Label>

                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Strength bar */}
                    {password && (
                        <div className="space-y-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1.5 flex-1 rounded-full transition-all ${
                                            strength >= level ? strengthColor : "bg-muted"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Strength:{" "}
                                <span className="font-medium text-foreground">{strengthLabel}</span>
                            </p>
                        </div>
                    )}

                    {/* Rules */}
                    <ul className="text-xs space-y-1 text-muted-foreground">
                        {[
                            { label: "At least 8 characters", test: password.length >= 8 },
                            { label: "One uppercase letter", test: /[A-Z]/.test(password) },
                            { label: "One number", test: /[0-9]/.test(password) },
                            { label: "One special character", test: /[^A-Za-z0-9]/.test(password) },
                        ].map(({ label, test }) => (
                            <li key={label} className={test ? "text-green-500" : ""}>
                                {test ? "✓" : "•"} {label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>

                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {confirmPassword && (
                        <p className={`text-xs ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
                            {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                        </p>
                    )}
                </div>

                <Button
                    type="button"
                    className="h-12 w-full text-primary-foreground hover:opacity-90"
                    disabled={!isValid || isProcessing}
                    onClick={handleResetPassword}
                >
                    {isProcessing ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Resetting...
                        </div>
                    ) : (
                        "Reset Password"
                    )}
                </Button>

                <div
                    className="text-center cursor-pointer text-sm text-muted-foreground"
                    onClick={() => navigate("/verify-otp")}
                >
                    Wrong code?{" "}
                    <span className="text-primary font-medium">Go back</span>
                </div>
            </div>
        </div>
    );
}