import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { useCheckInVisitorMutation } from "../visitorApiSlice";
import { handleApiError, validateNigerianPhone } from "../../../utils/functions";
import type { VisitorProfileResponse } from "../../../types/visitor.types";
import type { Gender, HowHeardAboutUs, LevelOfEducation, ServiceType } from "../types/visitor.types";
import { selectCurrentUser } from "../../auth/authSlice";

// ─── Constants ──────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
] as const;

const HOW_HEARD_OPTIONS = [
    { value: "SOCIAL_MEDIA", label: "Social Media" },
    { value: "FRIEND_OR_FAMILY", label: "Friend or Family" },
    { value: "CHURCH_MEMBER", label: "Church Member" },
    { value: "FLYER_OR_BANNER", label: "Flyer or Banner" },
    { value: "WEBSITE", label: "Website" },
    { value: "WALK_IN", label: "Walk-in" },
    { value: "OTHER", label: "Other" },
] as const;

const EDUCATION_OPTIONS = [
    { value: "NO_FORMAL_EDUCATION", label: "No Formal Education" },
    { value: "PRIMARY", label: "Primary" },
    { value: "SECONDARY", label: "Secondary" },
    { value: "TERTIARY", label: "Tertiary" },
    { value: "POSTGRADUATE", label: "Postgraduate" },
] as const;

const SERVICE_TYPE_OPTIONS = [
    { value: "SUNDAY_SERVICE", label: "Sunday Service" },
    { value: "MIDWEEK_SERVICE", label: "Midweek Service" },
    { value: "SPECIAL_EVENT", label: "Special Event" },
    { value: "OTHER", label: "Other" },
] as const;

export default function VisitorCheckInPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get the current logged-in user
    const currentUser = useSelector(selectCurrentUser);
    const recordedById = currentUser?.id || "";
    
    const existingVisitor = location.state?.visitor as VisitorProfileResponse | undefined;
    
    // Initialize form data with existing visitor data if available
    const [formData, setFormData] = useState({
        memberId: existingVisitor?.memberId || "",
        firstName: existingVisitor?.member.firstName || "",
        lastName: existingVisitor?.member.lastName || "",
        phone: existingVisitor?.member.phone || "",
        email: existingVisitor?.member.email || "",
        gender: existingVisitor?.member.gender || "",
        homeAddress: existingVisitor?.member.homeAddress || "",
        localGovernmentArea: existingVisitor?.member.localGovernmentArea || "",
        birthday: existingVisitor?.member.birthday || "",
        isBeliever: existingVisitor?.member.isBeliever || false,
        // Pre-populate visitor profile fields from existing visitor
        howHeardAboutUs: existingVisitor?.howHeardAboutUs || "",
        levelOfEducation: existingVisitor?.levelOfEducation || "",
        preferenceToReturn: existingVisitor?.preferenceToReturn || false,
        whatTheyLovedMost: existingVisitor?.whatTheyLovedMost || "",
        serviceType: "",
        notes: "",
        recordedById: recordedById,
    });

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [checkInVisitor, { isLoading }] = useCheckInVisitorMutation();

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, phone: value }));
        setPhoneTouched(true);
        
        if (value.trim() === "") {
            setPhoneError("Phone number is required");
            return;
        }
        
        const result = validateNigerianPhone(value);
        if (!result.valid) {
            setPhoneError(result.error || null);
        } else {
            setPhoneError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that user is logged in
        if (!recordedById) {
            toast.error("You must be logged in to check in a visitor");
            return;
        }

        // Validate required fields
        if (!formData.memberId && (!formData.firstName || !formData.lastName || !formData.phone)) {
            toast.error("First name, last name, and phone are required for new visitors");
            return;
        }

        if (!formData.howHeardAboutUs) {
            toast.error("Please select how they heard about us");
            return;
        }

        if (!formData.levelOfEducation) {
            toast.error("Please select education level");
            return;
        }

        if (!formData.serviceType) {
            toast.error("Please select service type");
            return;
        }

        const phoneValidation = validateNigerianPhone(formData.phone);
        if (!phoneValidation.valid) {
            toast.error(phoneValidation.error || "Invalid phone number");
            setPhoneError(phoneValidation.error || null);
            setPhoneTouched(true);
            return;
        }

        try {
            await checkInVisitor({
                memberId: formData.memberId || undefined,
                firstName: formData.firstName || undefined,
                lastName: formData.lastName || undefined,
                phone: phoneValidation.formatted || formData.phone,
                email: formData.email || undefined,
                gender: formData.gender as Gender || undefined,
                homeAddress: formData.homeAddress || undefined,
                localGovernmentArea: formData.localGovernmentArea || undefined,
                birthday: formData.birthday || undefined,
                isBeliever: formData.isBeliever,
                howHeardAboutUs: formData.howHeardAboutUs as HowHeardAboutUs,
                levelOfEducation: formData.levelOfEducation as LevelOfEducation,
                preferenceToReturn: formData.preferenceToReturn,
                whatTheyLovedMost: formData.whatTheyLovedMost || undefined,
                serviceType: formData.serviceType as ServiceType,
                notes: formData.notes || undefined,
                recordedById: recordedById,
            }).unwrap();

            toast.success(existingVisitor ? "Visit recorded successfully!" : "Visitor checked in successfully!");
            navigate("/visitors");
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/visitors")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    icon={<UserPlus />}
                    title={existingVisitor ? "Record Visit" : "Check-in Visitor"}
                    subtitle={existingVisitor ? `Record a new visit for ${existingVisitor.member.firstName}` : "Welcome a new visitor to church"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {!existingVisitor && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => handleChange("firstName", e.target.value)}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => handleChange("lastName", e.target.value)}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </>
                                )}

                                {existingVisitor && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>First Name</Label>
                                            <div className="p-2 bg-muted/30 rounded-md text-sm">
                                                {formData.firstName}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Name</Label>
                                            <div className="p-2 bg-muted/30 rounded-md text-sm">
                                                {formData.lastName}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            onBlur={() => setPhoneTouched(true)}
                                            placeholder="e.g., 08012345678 or +2348012345678"
                                            className={`pl-10 ${phoneError && phoneTouched ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`}
                                            disabled={!!existingVisitor}
                                        />
                                    </div>
                                    {phoneError && phoneTouched && (
                                        <p className="text-xs text-red-500">{phoneError}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid Nigerian phone number
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            placeholder="you@example.com"
                                            className="pl-10"
                                            disabled={!!existingVisitor}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender || "none"}
                                        onValueChange={(value) => handleChange("gender", value === "none" ? "" : value)}
                                        disabled={!!existingVisitor}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Not specified</SelectItem>
                                            {GENDER_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="birthday"
                                            type="date"
                                            value={formData.birthday}
                                            onChange={(e) => handleChange("birthday", e.target.value)}
                                            className="pl-10"
                                            disabled={!!existingVisitor}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="homeAddress">Home Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="homeAddress"
                                            value={formData.homeAddress}
                                            onChange={(e) => handleChange("homeAddress", e.target.value)}
                                            placeholder="Enter home address"
                                            className="pl-10"
                                            disabled={!!existingVisitor}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="localGovernmentArea">Local Government Area</Label>
                                    <Input
                                        id="localGovernmentArea"
                                        value={formData.localGovernmentArea}
                                        onChange={(e) => handleChange("localGovernmentArea", e.target.value)}
                                        placeholder="Enter LGA"
                                        disabled={!!existingVisitor}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isBeliever"
                                        checked={formData.isBeliever}
                                        onCheckedChange={(checked) => handleChange("isBeliever", checked)}
                                        disabled={!!existingVisitor}
                                    />
                                    <Label htmlFor="isBeliever" className="cursor-pointer">Is a Believer</Label>
                                </div>
                            </div>
                        </div>

                        {/* Visitor Information */}
                        <div className="border-t border-muted/30 pt-4">
                            <h3 className="text-lg font-semibold mb-4">Visitor Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="howHeardAboutUs">How Heard About Us *</Label>
                                    <Select
                                        value={formData.howHeardAboutUs || "none"}
                                        onValueChange={(value) => handleChange("howHeardAboutUs", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select how they heard" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Select a source</SelectItem>
                                            {HOW_HEARD_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="levelOfEducation">Education Level *</Label>
                                    <Select
                                        value={formData.levelOfEducation || "none"}
                                        onValueChange={(value) => handleChange("levelOfEducation", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Select education level</SelectItem>
                                            {EDUCATION_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serviceType">Service Type *</Label>
                                    <Select
                                        value={formData.serviceType || "none"}
                                        onValueChange={(value) => handleChange("serviceType", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select service type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Select service type</SelectItem>
                                            {SERVICE_TYPE_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatTheyLovedMost">What They Loved Most</Label>
                                    <Input
                                        id="whatTheyLovedMost"
                                        value={formData.whatTheyLovedMost}
                                        onChange={(e) => handleChange("whatTheyLovedMost", e.target.value)}
                                        placeholder="e.g., The worship, message, hospitality"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="preferenceToReturn"
                                        checked={formData.preferenceToReturn}
                                        onCheckedChange={(checked) => handleChange("preferenceToReturn", checked)}
                                    />
                                    <Label htmlFor="preferenceToReturn" className="cursor-pointer">Would Return</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => handleChange("notes", e.target.value)}
                                        placeholder="Any additional notes about this visitor"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/visitors")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !recordedById}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {existingVisitor ? "Record Visit" : "Check-in Visitor"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}