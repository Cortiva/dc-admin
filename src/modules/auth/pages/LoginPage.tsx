import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from '../authSlice';
import { getGreeting, handleApiError } from '../../../utils/functions';
import { Button } from '../../../components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { useLoginMutation } from '../authApiSlice';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState(
    localStorage.getItem("paName") ?? "Admin"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    console.log("Attempting login with email:", email);
    try {
      const result = await login({
        email,
        password
      }).unwrap();

      console.log("Login result:", result);

      const { accessToken, refreshToken, user, expiresIn, tokenType } =
        result.data;
      
      setUsername(user.firstName);

      if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        toast.error("Access denied — admin accounts only");
        return;
      }

      dispatch(setCredentials({ token: accessToken, refreshToken, user, expiresIn, tokenType }));
      toast.success(`Welcome back, ${user.firstName}`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      handleApiError(err);
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

        {/* Submit */}
        <div className="flex flex-row justify-center items-center">
          <Button
            type="button"
            className="h-12 w-50 hover:opacity-90 mt-4"
            disabled={isLoading || !email || !password}
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