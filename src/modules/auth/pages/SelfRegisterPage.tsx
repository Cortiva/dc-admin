// pages/auth/SelfRegisterPage.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useSelfRegisterMutation, useValidateMemberNumberMutation } from "../authApiSlice";
import { handleApiError } from "../../../utils/functions";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

// ─── Password Strength Helper ──────────────────────────────────────────────

function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { score, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SelfRegisterPage() {
    const navigate = useNavigate();
    const [validateMemberNumber, { isLoading: isValidating }] = useValidateMemberNumberMutation();
    const [selfRegister, { isLoading: isRegistering }] = useSelfRegisterMutation();

    // Step 1: Member Number
    const [memberNumber, setMemberNumber] = useState("");
    const [memberNumberError, setMemberNumberError] = useState<string | null>(null);
    const [isMemberValid, setIsMemberValid] = useState(false);
    const [memberInfo, setMemberInfo] = useState<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        isFullMember: boolean;
    } | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Step 2: Password
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Step 3: Optional contact update
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const strength = getStrength(password);

    // Format member number (DC-YYYY-XXX)
    const formatMemberNumber = (value: string) => {
        const clean = value.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase();
        return clean;
    };

    const handleMemberNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatMemberNumber(e.target.value);
        setMemberNumber(formatted);
        setMemberNumberError(null);
        setIsMemberValid(false);
        setMemberInfo(null);
        setIsVerifying(false);
    };

    const handleValidateMember = async () => {
        if (memberNumber.length < 8) {
            setMemberNumberError("Please enter a valid member number (e.g., DC-2024-001)");
            return;
        }

        setIsVerifying(true);
        try {
            const result = await validateMemberNumber({ memberNumber }).unwrap();
            
            if (result.data.valid && result.data.member) {
                setIsMemberValid(true);
                setMemberInfo(result.data.member);
                setMemberNumberError(null);
                // Pre-fill email and phone if available
                if (result.data.member.email) setEmail(result.data.member.email);
                if (result.data.member.phone) setPhone(result.data.member.phone);
                toast.success(`Welcome ${result.data.member.firstName}! Please set your password.`);
            } else {
                setMemberNumberError(result.data.message || "Invalid member number");
                setIsMemberValid(false);
                setMemberInfo(null);
            }
        } catch (err) {
            setMemberNumberError("Error validating member number. Please try again.");
            handleApiError(err);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isMemberValid) {
            e.preventDefault();
            handleValidateMember();
        }
    };

    const isFormValid =
        isMemberValid &&
        password.length >= 8 &&
        password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error("Please fix all errors before continuing");
            return;
        }

        try {
            await selfRegister({
                memberNumber: memberNumber,
                password,
                confirmPassword,
                email: email || undefined,
                phone: phone || undefined,
            }).unwrap();

            toast.success("Registration successful! Please verify your email.");
            navigate("/verify-otp", {
                state: {
                    email: email || memberInfo?.email,
                    purpose: "registration",
                    redirect: "/login",
                },
            });
        } catch (err) {
            handleApiError(err);
        }
    };

    const isLoading = isValidating || isRegistering;

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Enter your church member number to get started
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Member Number */}
                <div className="space-y-1.5">
                    <Label htmlFor="memberNumber">Member Number</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                id="memberNumber"
                                type="text"
                                value={memberNumber}
                                onChange={handleMemberNumberChange}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g., DC-2024-001"
                                className={`h-11 pl-10 ${
                                    memberNumberError 
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                        : isMemberValid 
                                            ? "border-green-500 focus:border-green-500 focus:ring-green-500/30" 
                                            : ""
                                }`}
                                disabled={isMemberValid || isLoading || isVerifying}
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            {isMemberValid && (
                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                        </div>
                        {!isMemberValid && (
                            <Button
                                type="button"
                                onClick={handleValidateMember}
                                disabled={memberNumber.length < 8 || isLoading || isVerifying}
                                className="h-11 px-4 whitespace-nowrap"
                            >
                                {isValidating ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    "Verify"
                                )}
                            </Button>
                        )}
                    </div>
                    {memberNumberError ? (
                        <p className="text-xs text-red-500 mt-1">{memberNumberError}</p>
                    ) : isMemberValid ? (
                        <p className="text-xs text-green-600 mt-1">✓ Member verified</p>
                    ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter your church member number (e.g., DC-2024-001)
                        </p>
                    )}
                </div>

                {/* Member Info Display */}
                {isMemberValid && memberInfo && (
                    <div className="bg-primary/5 rounded-lg p-4 space-y-2 border border-primary/20">
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Member Found
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{memberInfo.firstName} {memberInfo.lastName}</span>
                            {memberInfo.email && (
                                <>
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{memberInfo.email}</span>
                                </>
                            )}
                            {memberInfo.phone && (
                                <>
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{memberInfo.phone}</span>
                                </>
                            )}
                            {memberInfo.isFullMember && (
                                <>
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium text-green-600">Full Member</span>
                                </>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            You can update your contact details below if needed.
                        </p>
                    </div>
                )}

                {/* Step 2: Contact Details (Optional Update) */}
                {isMemberValid && (
                    <>
                        <div className="border-t border-border my-4" />
                        <p className="text-xs text-muted-foreground">
                            Update your contact details if needed (optional)
                        </p>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={memberInfo?.email || "your@email.com"}
                                    className="h-11 pl-10"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={memberInfo?.phone || "+2348012345678"}
                                    className="h-11 pl-10"
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Include country code (e.g., +234 for Nigeria)
                            </p>
                        </div>
                    </>
                )}

                {/* Step 3: Password */}
                {isMemberValid && (
                    <>
                        <div className="border-t border-border my-4" />
                        
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

                            {/* Password strength */}
                            {password && (
                                <div className="space-y-1 mt-1.5">
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
                                    <div className="flex items-center justify-between">
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
                                        {password.length > 0 && password.length < 8 && (
                                            <p className="text-xs text-red-500">
                                                Min. 8 characters
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                    className={`h-11 pr-11 ${
                                        confirmPassword && confirmPassword !== password
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                                            : ""
                                    }`}
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
                            {confirmPassword && confirmPassword === password && password.length >= 8 && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle size={12} />
                                    Passwords match
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className="w-full h-11 mt-4"
                >
                    {isRegistering ? (
                        <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Creating account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>

            <div className="mt-6 space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                    Don't have a member number?{" "}
                    <div className="text-primary hover:underline">
                        Contact the church office
                    </div>
                </p>
            </div>
        </div>
    );
}