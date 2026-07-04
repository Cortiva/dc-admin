import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ChevronLeft, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { handleApiError } from "../../../utils/functions";
import { Button } from "../../../components/ui/button";
import { useVerifyEmailMutation, useResendOtpMutation } from "../authApiSlice";

const OTP_LENGTH = 6;
const RESEND_COOL_DOWN = 60; // seconds

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // State injected by the previous page
    const { email, purpose, redirect } = (location.state ?? {}) as {
        email?: string;
        purpose?: "registration" | "password_reset";
        redirect?: string;
    };

    const [verifyOtp, { isLoading: verifying }] = useVerifyEmailMutation();
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

    // OTP digit slots
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [countdown, setCountdown] = useState(RESEND_COOL_DOWN);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    // Redirect if no email/purpose
    useEffect(() => {
        if (!email || !purpose) {
            navigate("/login", { replace: true });
        }
    }, [email, purpose, navigate]);

    const otp = digits.join("");

    const handleDigitChange = (index: number, value: string) => {
        // Allow paste of full OTP
        if (value.length > 1) {
            const pasted = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
            const next = [...digits];
            pasted.split("").forEach((ch, i) => {
                if (i < OTP_LENGTH) next[i] = ch;
            });
            setDigits(next);
            inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
            return;
        }

        const clean = value.replace(/\D/g, "");
        const next = [...digits];
        next[index] = clean;
        setDigits(next);

        if (clean && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const next = [...digits];
        pasted.split("").forEach((ch, i) => {
            if (i < OTP_LENGTH) next[i] = ch;
        });
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = async () => {
        if (otp.length < OTP_LENGTH) {
            toast.error(`Enter the ${OTP_LENGTH}-digit code`);
            return;
        }

        try {
            await verifyOtp({ email: email!, otp }).unwrap();

            if (purpose === "registration") {
                toast.success("Account verified! You can now sign in.");
                navigate(redirect ?? "/login", { replace: true });
            } else {
                toast.success("OTP verified. Set your new password.");
                navigate("/reset-password", {
                    state: { email, resetToken: otp },
                    replace: true,
                });
            }
        } catch (err) {
            handleApiError(err);
            setDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        try {
            await resendOtp({
                email: email!,
                purpose: purpose === "registration" ? "EMAIL_VERIFICATION" : "PASSWORD_RESET",
            }).unwrap();
            toast.success("New OTP sent to your email");
            setCountdown(RESEND_COOL_DOWN);
            setDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err) {
            handleApiError(err);
        }
    };

    if (!email || !purpose) return null;

    return (
        <div className="w-full max-w-sm">
            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck size={28} className="text-primary" />
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                    {purpose === "registration" ? "Verify your email" : "Enter OTP"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    We sent a {OTP_LENGTH}-digit code to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>

            {/* OTP digit inputs */}
            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={OTP_LENGTH}
                        value={digit}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-12 text-center text-lg font-bold bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                ))}
            </div>

            {/* Verify button */}
            <div className="flex flex-row justify-center items-center">
                <Button
                    onClick={handleVerify}
                    disabled={verifying || otp.length < OTP_LENGTH}
                    className="w-50"
                >
                    {verifying && <Loader2 size={16} className="animate-spin" />}
                    {verifying ? "Verifying..." : "Verify"}
                </Button>
            </div>

            {/* Resend */}
            <div className="mt-4 text-center">
                <button                    onClick={handleResend}
                    disabled={countdown > 0 || resending}
                    className="flex items-center gap-1.5 mx-auto text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <RotateCcw size={14} />
                    {countdown > 0
                        ? `Resend in ${countdown}s`
                        : resending
                            ? "Sending..."
                            : "Resend OTP"}
                </button>
            </div>

            {/* Back */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                    to={purpose === "registration" ? "/register" : "/forgot-password"}
                    className="flex flex-row justify-center items-center gap-1.5 text-primary hover:underline font-medium"
                >
                    <ChevronLeft size={14} />
                    Go back
                </Link>
            </p>
        </div>
    );
}