import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAcceptInviteMutation } from "../authApiSlice";
import { handleApiError } from "../../../utils/functions";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function AcceptInvitePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [acceptInvite, { isLoading }] = useAcceptInviteMutation();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing invitation token");
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    const validatePassword = (pwd: string) => {
        const errors = [];
        if (pwd.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
        if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
        if (!/[0-9]/.test(pwd)) errors.push("One number");
        return errors;
    };

    const passwordErrors = validatePassword(password);
    const isPasswordValid = passwordErrors.length === 0 && password.length > 0;
    const isFormValid = isPasswordValid && password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error("Please fix all errors before continuing");
            return;
        }

        if (!token) {
            toast.error("Invalid invitation token");
            return;
        }

        try {
            await acceptInvite({
                token,
                password,
                confirmPassword,
            }).unwrap();

            setAccepted(true);
            toast.success("Invitation accepted! You can now sign in.");
        } catch (err) {
            handleApiError(err);
        }
    };

    if (accepted) {
        return (
            <div className="w-full max-w-sm text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
                        <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Invitation Accepted!</h1>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                    Your account has been set up successfully. You can now sign in.
                </p>
                <Button
                    onClick={() => navigate("/login", { replace: true })}
                    className="w-full"
                >
                    Sign in
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">Accept Invitation</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Set up your password to complete the invitation process
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Min. 8 characters"
                            className="h-11 pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Password requirements */}
                    {password && (
                        <div className="space-y-1 mt-1.5">
                            {passwordErrors.map((error, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                    <XCircle size={12} className="text-red-500" />
                                    <span className="text-muted-foreground">{error}</span>
                                </div>
                            ))}
                            {isPasswordValid && (
                                <div className="flex items-center gap-1.5 text-xs">
                                    <CheckCircle size={12} className="text-green-500" />
                                    <span className="text-green-600">Password meets requirements</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-enter password"
                            className="h-11 pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                        <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className="w-full h-11 mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Setting up account...
                        </>
                    ) : (
                        "Accept Invitation"
                    )}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary font-medium hover:underline">
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}