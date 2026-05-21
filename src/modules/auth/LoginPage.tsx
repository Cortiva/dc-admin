import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from './authSlice';
import { getGreeting, handleApiError } from '../../utils/functions';
import { mockLogin } from '../../mock/mockAuth'; // 👈 swap when API ready
import { Button } from '../../components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import type { User } from '../../types/user';

// const [login] = useLoginMutation(); // 👈 uncomment when API ready
const IS_MOCK = true; // 👈 flip to false when API is ready

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [username] = useState(
    localStorage.getItem("paName") ?? "Admin"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getDeviceInfo = () => ({
    deviceId: localStorage.getItem("deviceId") || crypto.randomUUID(),
    deviceType: /mobile/i.test(navigator.userAgent) ? "mobile" : "web",
    userAgent: navigator.userAgent,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setIsProcessing(true);

      const deviceInfo = getDeviceInfo();
      localStorage.setItem("deviceId", deviceInfo.deviceId);

      let accessToken: string;
      const refreshToken: string = "";
      let user: User;
      const expiresIn: number = 3600;
      const tokenType: string = "Bearer";

      if (IS_MOCK) {
        const result = await mockLogin(email, password);

        // Shape mock result to match what the real API returns
        accessToken = result.token;
        user = result.user as User;
      } else {
        // const result = await login({ email, password, rememberMe, deviceInfo }).unwrap();
        // ({ accessToken, refreshToken, user, expiresIn, tokenType } = result);
      }

      dispatch(
        setCredentials({
          token: accessToken!,
          refreshToken,
          user: user!, // This will now be the correct type
          expiresIn,
          tokenType,
        })
      );

      if (rememberMe) {
        localStorage.setItem("paName", user!.firstName);
      } else {
        localStorage.removeItem("paName");
      }

      toast.success(`Welcome back, ${user!.firstName}!`);
      navigate("/", { replace: true });

    } catch (error) {
      handleApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-3xl font-bold font-heading">
          {getGreeting()}, {username} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome back. Let's pick up where you left off.
        </p>

        {/* Mock hint — remove before going live */}
        {IS_MOCK && (
          <div className="mt-2 rounded-lg border border-dashed border-yellow-400/50 bg-yellow-400/5 px-4 py-2 text-xs text-yellow-600 dark:text-yellow-400">
            <span className="font-semibold">Mock mode:</span> use{" "}
            <span className="font-mono">james@gmail.com</span> /{" "}
            <span className="font-mono">Password@2</span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-5">
        {/* Email */}
        <div className="flex flex-col space-y-3">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            required
            className="h-12"
          />
        </div>

        {/* Password */}
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              required
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-5 w-5 rounded border border-border bg-background accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="button"
          className="h-12 w-full hover:opacity-90 mt-4"
          disabled={isProcessing || !email || !password}
          onClick={handleLogin}
        >
          {isProcessing ? (
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
  );
}