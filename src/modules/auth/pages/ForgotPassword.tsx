// Step 1 of password reset: collect email, send OTP, navigate to VerifyOtpPage.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "../authApiSlice";
import { handleApiError } from "../../../utils/functions";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [forgotPassword, { isLoading: requesting }] = useForgotPasswordMutation();

    const [email, setEmail] = useState("");
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
 
        try {
            // 1. Tell the backend to initiate password reset for this email
            await forgotPassword({ email }).unwrap();
 
            toast.success("OTP sent to your registered email address");
            navigate("/verify-otp", {
                state: {
                    email,
                    purpose:  "password_reset",
                    redirect: "/reset-password",
                },
            });
        } catch (err) {
            handleApiError(err);
        }
    };
 
    const isLoading = requesting;
 
    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Enter your registered email address. We'll send an OTP to verify it's you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email address
                    </Label>
                    <div className="relative mt-1.5">
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="h-12 pr-12"
                        />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-center mt-10">
                    <Button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-50"
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                </div>
            </form>

            <p className="mt-3 text-center text-sm text-muted-foreground">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-primary font-medium">
                    <ChevronLeft size={14} />
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}