// Step 3 of password reset (after OTP verified): set new password.
// Expects location.state: { phone, resetToken }
 
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../authApiSlice";
import { handleApiError } from "../../../utils/functions";
 
// ── Password strength helper ───────────────────────────────────────────────────
 
function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8)                      score++;
    if (/[A-Z]/.test(pw))                    score++;
    if (/[0-9]/.test(pw))                    score++;
    if (/[^A-Za-z0-9]/.test(pw))            score++;
 
    if (score <= 1) return { score, label: "Weak",   color: "bg-red-500" };
    if (score === 2) return { score, label: "Fair",   color: "bg-amber-500" };
    if (score === 3) return { score, label: "Good",   color: "bg-blue-500" };
    return              { score, label: "Strong", color: "bg-green-500" };
}
 
export default function ResetPasswordPage() {
    const navigate  = useNavigate();
    const location  = useLocation();
 
    const { email, resetToken } = (location.state ?? {}) as {
        email?:      string;
        resetToken?: string;
    };
 
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
 
    const [newPassword,    setNewPassword]    = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [showNew,        setShowNew]        = useState(false);
    const [showConfirm,    setShowConfirm]    = useState(false);
    const [success,        setSuccess]        = useState(false);
 
    const strength = getStrength(newPassword);
 
    // Redirect if state is missing
    if (!email || !resetToken) {
        navigate("/forgot-password", { replace: true });
        return null;
    }
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
 
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
 
        try {
            await resetPassword({ email, otp: resetToken, newPassword, confirmPassword }).unwrap();
            setSuccess(true);
        } catch (err) {
            handleApiError(err);
        }
    };
 
    if (success) {
        return (
            <div className="w-full max-w-sm text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
                        <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Password reset!</h1>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                    Your password has been updated successfully. You can now sign in with your new password.
                </p>
                <button
                    onClick={() => navigate("/login", { replace: true })}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-sm transition-colors"
                >
                    Sign in
                </button>
            </div>
        );
    }
 
    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Choose a strong password for{" "}
                    <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>
 
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">New password</label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Min. 8 characters"
                            className="w-full px-3 py-2.5 pr-10 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
 
                    {/* Strength bar */}
                    {newPassword && (
                        <div className="space-y-1">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-colors ${
                                            i <= strength.score ? strength.color : "bg-muted"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Strength:{" "}
                                <span className={`font-medium ${
                                    strength.label === "Strong" ? "text-green-600" :
                                    strength.label === "Good"   ? "text-blue-600"  :
                                    strength.label === "Fair"   ? "text-amber-600" : "text-red-600"
                                }`}>
                                    {strength.label}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
 
                {/* Confirm */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Confirm password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-enter new password"
                            className={`w-full px-3 py-2.5 pr-10 text-sm bg-background border rounded-sm focus:outline-none focus:ring-2 transition-colors ${
                                confirmPassword && confirmPassword !== newPassword
                                    ? "border-red-400 focus:ring-red-400/30"
                                    : "border-border focus:ring-primary/30 focus:border-primary"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                </div>
 
                <button
                    type="submit"
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    {isLoading ? "Resetting..." : "Reset password"}
                </button>
            </form>
 
            <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium">
                    <ArrowLeft size={14} />
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}