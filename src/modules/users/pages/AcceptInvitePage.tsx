import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { handleApiError } from "../../../utils/functions";
import { useAcceptInviteMutation } from "../usersApiSlice";

export default function AcceptInvitePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [done, setDone] = useState(false);

    const [acceptInvite, { isLoading }] = useAcceptInviteMutation();

    const passwordsMatch = password.length > 0 && password === confirmPassword;
    const isFormValid = password.length >= 8 && passwordsMatch;

    if (!token) {
        return (
            <div className="w-full max-w-md flex flex-col space-y-4 text-center">
                <h2 className="text-2xl font-bold font-heading">Invite link not found</h2>
                <p className="text-muted-foreground text-sm">
                    This link is missing its invite token. Ask whoever invited you to send
                    a new one.
                </p>
                <Button variant="outline" onClick={() => navigate("/login")}>
                    Back to sign in
                </Button>
            </div>
        );
    }

    if (done) {
        return (
            <div className="w-full max-w-md flex flex-col items-center space-y-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <h2 className="text-2xl font-bold font-heading">You're all set</h2>
                <p className="text-muted-foreground text-sm">
                    Your password has been created. Sign in to get started.
                </p>
                <Button className="w-full h-12" onClick={() => navigate("/login")}>
                    Sign in
                </Button>
            </div>
        );
    }

    const handleSubmit = async () => {
        if (!isFormValid) return;
        try {
            await acceptInvite({ token, password, confirmPassword }).unwrap();
            setDone(true);
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            void handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-md flex flex-col space-y-8">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-3xl font-bold font-heading">Welcome aboard 👋</h2>
                <p className="text-muted-foreground text-sm">
                    Create a password to finish setting up your account.
                </p>
            </div>

            <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-3">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoComplete="new-password"
                            required
                            className="h-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {password.length > 0 && password.length < 8 && (
                        <p className="text-xs text-red-600">Use at least 8 characters.</p>
                    )}
                </div>

                <div className="flex flex-col space-y-3">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="new-password"
                        required
                        className="h-12"
                    />
                    {confirmPassword.length > 0 && !passwordsMatch && (
                        <p className="text-xs text-red-600">Passwords don't match.</p>
                    )}
                </div>

                <Button
                    className="h-12 w-full mt-2"
                    disabled={!isFormValid || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Setting up your account...
                        </div>
                    ) : (
                        "Create account"
                    )}
                </Button>
            </div>
        </div>
    );
}