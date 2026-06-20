import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../authSlice";
import { getGreeting, handleApiError } from "../../../utils/functions";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useLoginMutation } from "../authApiSlice";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(
        () => localStorage.getItem("paName") ?? "Admin",
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const isFormValid = email.trim() !== "" && password !== "";

    const handleLogin = async () => {
        if (!isFormValid || isLoading) return;

        try {
            const result = await login({ email, password }).unwrap();
            const { accessToken, refreshToken, user, expiresIn, tokenType } =
                result.data;

            if (!ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
                toast.error("Access denied — admin accounts only");
                return;
            }

            // Persist the display name so the greeting survives a reload,
            // not just the in-memory state for this session.
            localStorage.setItem("paName", user.firstName);
            setUsername(user.firstName);

            dispatch(
                setCredentials({
                    token: accessToken,
                    refreshToken,
                    user,
                    expiresIn,
                    tokenType,
                }),
            );
            toast.success(`Welcome back, ${user.firstName}`);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            void handleLogin();
        }
    };

    return (
        <div className="w-full max-w-md flex flex-col space-y-8">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-3xl font-bold font-heading">
                    {getGreeting()}, {username} 👋
                </h2>
                <p className="text-muted-foreground text-sm">
                    Welcome back. Let's pick up where you left off.
                </p>
            </div>

            <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="email"
                        required
                        className="h-12"
                    />
                </div>

                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                            type="button"
                            className="text-xs font-medium text-primary cursor-pointer"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoComplete="current-password"
                            required
                            className="h-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex flex-row justify-center items-center">
                    <Button
                        type="button"
                        className="h-12 w-50 hover:opacity-90 mt-4"
                        disabled={isLoading || !isFormValid}
                        onClick={handleLogin}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}