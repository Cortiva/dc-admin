import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { mockForgotPassword, mockVerifyOTP } from "../../mock/mockAuth"; // 👈 swap when API ready
import { formatTime, handleApiError } from "../../utils/functions";
import { ShieldCheck } from "lucide-react";

// const [verifyEmail] = useVerifyEmailMutation(); // 👈 uncomment when API ready
const IS_MOCK = true; // 👈 flip to false when API is ready

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const email = localStorage.getItem("tempEmail");

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle input
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);
    newOtp.forEach((digit, i) => {
      if (inputsRef.current[i]) inputsRef.current[i]!.value = digit;
    });
  };

  const otpValue = otp.join("");

  // Submit
  const handleVerify = async () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      toast.error("Session expired. Please start over.");
      navigate("/forgot-password");
      return;
    }

    try {
      setIsProcessing(true);

      let result;

      if (IS_MOCK) {
        result = await mockVerifyOTP(email, otpValue);
      } else {
        // const res = await verifyEmail({ email, token: otpValue }).unwrap();
        // result = res;
      }

      localStorage.setItem("tmpTkn", otpValue);
      localStorage.setItem("resetToken", result!.resetToken); // 👈 store resetToken for step 3
      toast.success(result!.message);
      navigate("/reset-password");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!email) return;

    try {
      setIsResending(true);

      if (IS_MOCK) {
        await mockForgotPassword(email); // re-triggers OTP generation + console log
      } else {
        // await forgotPassword({ email }).unwrap();
      }

      setTimeLeft(300);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      toast.success("A new code has been sent. Check your console.");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold font-heading">Check Your Email</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          <br />It expires in 5 minutes.
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="space-y-4">
        <Label>Verification Code</Label>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
                h-14 w-12 rounded-xl border border-border
                bg-background text-center text-xl font-semibold
                focus:border-primary focus:ring-2 focus:ring-primary/30
                outline-none transition-all
              "
            />
          ))}
        </div>
      </div>

      {/* Timer / Resend */}
      <div className="text-center text-sm text-muted-foreground">
        {timeLeft > 0 ? (
          <p>
            Resend code in{" "}
            <span className="font-semibold text-foreground">
              {formatTime(timeLeft)}
            </span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-primary font-medium cursor-pointer disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </button>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={handleVerify}
        disabled={isProcessing || otpValue.length < 6}
        className="h-12 w-full text-primary-foreground hover:opacity-90"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Verifying...
          </div>
        ) : (
          "Verify Code"
        )}
      </Button>

      <div
        className="text-center cursor-pointer text-sm text-muted-foreground"
        onClick={() => navigate("/forgot-password")}
      >
        Wrong email?{" "}
        <span className="text-primary font-medium">Go back</span>
      </div>
    </div>
  );
}