import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from '../../utils/functions';
// import { useForgotPasswordMutation } from './authApiSlice';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { mockForgotPassword } from '../../mock/mockAuth';

const IS_MOCK = true; // 👈 flip to false when API is ready

export default function ForgotPassword() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // Real mutation — uncomment when API is ready
    // const [forgotPassword] = useForgotPasswordMutation();

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setIsProcessing(true);

            let result;

            if (IS_MOCK) {
                result = await mockForgotPassword(email);
            } else {
                // result = await forgotPassword({ email }).unwrap();
            }

            localStorage.setItem("tempEmail", email);
            toast.success(result!.message);
            navigate("/verify-otp");
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold font-heading">Forgot Password?</h2>
                <p className="text-muted-foreground">Enter your registered email address to receive OTP.</p>
            </div>

            {IS_MOCK && (
            <div className="mt-2 rounded-lg border border-dashed border-yellow-400/50 bg-yellow-400/5 px-4 py-2 text-xs text-yellow-600 dark:text-yellow-400">
                <span className="font-semibold">Mock mode:</span> use{" "}
                <span className="font-mono">james@gmail.com</span>
            </div>
            )}

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="your@email.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                    />
                </div>

                <Button
                    type="button"
                    className="h-12 w-full text-primary-foreground hover:opacity-90"
                    disabled={isProcessing}
                    onClick={handleForgotPassword}
                >
                    {isProcessing ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Sending OTP...
                        </div>
                        ) : (
                        <div className="flex items-center gap-2">
                            Send OTP
                        </div>
                    )}
                </Button>

                <div
                    className="text-center cursor-pointer text-sm text-muted-foreground"
                    onClick={() => navigate("/login")}
                >
                    Remembered your password?{" "}
                    <span className="text-primary">Sign In</span>
                </div>
            </div>
        </div>
    );
}