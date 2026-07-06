import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
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
import { useCheckInVisitorMutation, useRecordVisitMutation } from "../visitorApiSlice";
import { handleApiError, validateNigerianPhone } from "../../../utils/functions";
import type { VisitorProfileResponse } from "../../../types/visitor.types";
import type { Gender, HowHeardAboutUs, LevelOfEducation, ServiceType } from "../types/visitor.types";
import { selectCurrentUser } from "../../auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { getInitials } from "../../../utils/functions";
import { Checkbox } from "../../../components/ui/checkbox";

// ─── Constants ──────────────────────────────────────────────────────────────

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
    const isRecordVisit = !!existingVisitor;
    
    // For new visitor check-in
    const [newVisitorForm, setNewVisitorForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        gender: "" as Gender | "",
        homeAddress: "",
        localGovernmentArea: "",
        birthday: "",
        isBeliever: false,
        howHeardAboutUs: "" as HowHeardAboutUs | "",
        levelOfEducation: "" as LevelOfEducation | "",
        preferenceToReturn: false,
        whatTheyLovedMost: "",
        serviceType: "" as ServiceType | "",
        notes: "",
    });

    // For recording a visit to existing visitor
    const [visitForm, setVisitForm] = useState({
        serviceType: "" as ServiceType | "",
        notes: "",
    });

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [checkInVisitor, { isLoading }] = useCheckInVisitorMutation();
    const [recordVisit, { isLoading: isRecordingVisit }] = useRecordVisitMutation();

    const handleNewVisitorChange = (field: string, value: any) => {
        setNewVisitorForm(prev => ({ ...prev, [field]: value }));
    };

    const handleVisitChange = (field: string, value: any) => {
        setVisitForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewVisitorForm(prev => ({ ...prev, phone: value }));
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

    const handleSubmitNewVisitor = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that user is logged in
        if (!recordedById) {
            toast.error("You must be logged in to check in a visitor");
            return;
        }

        // Validate required fields
        if (!newVisitorForm.firstName || !newVisitorForm.lastName || !newVisitorForm.phone) {
            toast.error("First name, last name, and phone are required");
            return;
        }

        if (!newVisitorForm.howHeardAboutUs) {
            toast.error("Please select how they heard about us");
            return;
        }

        if (!newVisitorForm.levelOfEducation) {
            toast.error("Please select education level");
            return;
        }

        if (!newVisitorForm.serviceType) {
            toast.error("Please select service type");
            return;
        }

        const phoneValidation = validateNigerianPhone(newVisitorForm.phone);
        if (!phoneValidation.valid) {
            toast.error(phoneValidation.error || "Invalid phone number");
            setPhoneError(phoneValidation.error || null);
            setPhoneTouched(true);
            return;
        }

        try {
            await checkInVisitor({
                memberId: undefined,
                firstName: newVisitorForm.firstName,
                lastName: newVisitorForm.lastName,
                phone: phoneValidation.formatted || newVisitorForm.phone,
                email: newVisitorForm.email || undefined,
                gender: newVisitorForm.gender as Gender || undefined,
                homeAddress: newVisitorForm.homeAddress || undefined,
                localGovernmentArea: newVisitorForm.localGovernmentArea || undefined,
                birthday: newVisitorForm.birthday || undefined,
                isBeliever: newVisitorForm.isBeliever,
                howHeardAboutUs: newVisitorForm.howHeardAboutUs as HowHeardAboutUs,
                levelOfEducation: newVisitorForm.levelOfEducation as LevelOfEducation,
                preferenceToReturn: newVisitorForm.preferenceToReturn,
                whatTheyLovedMost: newVisitorForm.whatTheyLovedMost || undefined,
                serviceType: newVisitorForm.serviceType as ServiceType,
                notes: newVisitorForm.notes || undefined,
                recordedById: recordedById,
            }).unwrap();

            toast.success("Visitor checked in successfully!");
            navigate("/visitors");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSubmitRecordVisit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that user is logged in
        if (!recordedById) {
            toast.error("You must be logged in to record a visit");
            return;
        }

        if (!existingVisitor) {
            toast.error("Visitor data not found");
            return;
        }

        if (!visitForm.serviceType) {
            toast.error("Please select service type");
            return;
        }

        try {
            await recordVisit({
                memberId: existingVisitor.memberId,
                serviceType: visitForm.serviceType as ServiceType,
                notes: visitForm.notes || undefined,
                recordedById: recordedById,
            }).unwrap();

            toast.success(`Visit recorded for ${existingVisitor.member.firstName}!`);
            navigate("/visitors");
        } catch (error) {
            handleApiError(error);
        }
    };

    // ─── Record Visit Mode ───────────────────────────────────────────────────

    if (isRecordVisit && existingVisitor) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/visitors")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<UserPlus />}
                        title="Record Visit"
                        subtitle={`Record a new visit for ${existingVisitor.member.firstName} ${existingVisitor.member.lastName}`}
                    />
                </div>

                {/* Visitor Summary Card */}
                <Card className="p-4 bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={existingVisitor.member.profileImageUrl || ""} />
                                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                    {getInitials(existingVisitor.member.firstName, existingVisitor.member.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">
                                    {existingVisitor.member.firstName} {existingVisitor.member.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {existingVisitor.member.phone} • {existingVisitor.visitCount} previous visits
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                            <Badge variant="secondary">{existingVisitor.status}</Badge>
                            <Badge variant="outline">Member #{existingVisitor.memberId.slice(0, 8)}</Badge>
                        </div>
                    </div>
                </Card>

                <form onSubmit={handleSubmitRecordVisit}>
                    <Card className="p-4 sm:p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="serviceType">Service Type *</Label>
                                <Select
                                    value={visitForm.serviceType || "none"}
                                    onValueChange={(value) => handleVisitChange("serviceType", value === "none" ? "" : value)}
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
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={visitForm.notes}
                                    onChange={(e) => handleVisitChange("notes", e.target.value)}
                                    placeholder="Any additional notes about this visit..."
                                    rows={4}
                                />
                            </div>

                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <span className="font-semibold">💡 Tip:</span> Recording a visit helps track visitor engagement and growth over time.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                            <Button variant="outline" type="button" onClick={() => navigate("/visitors")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isRecordingVisit || !recordedById}>
                                {isRecordingVisit && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Record Visit
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        );
    }

    // ─── New Visitor Check-in Mode ──────────────────────────────────────────

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/visitors")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    icon={<UserPlus />}
                    title="Check-in Visitor"
                    subtitle="Welcome a new visitor to church"
                />
            </div>

            <form onSubmit={handleSubmitNewVisitor}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        value={newVisitorForm.firstName}
                                        onChange={(e) => handleNewVisitorChange("firstName", e.target.value)}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        value={newVisitorForm.lastName}
                                        onChange={(e) => handleNewVisitorChange("lastName", e.target.value)}
                                        placeholder="Enter last name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={newVisitorForm.phone}
                                            onChange={handlePhoneChange}
                                            onBlur={() => setPhoneTouched(true)}
                                            placeholder="e.g., 08012345678 or +2348012345678"
                                            className={`pl-10 ${phoneError && phoneTouched ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`}
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
                                            value={newVisitorForm.email}
                                            onChange={(e) => handleNewVisitorChange("email", e.target.value)}
                                            placeholder="you@example.com"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={newVisitorForm.gender || "none"}
                                        onValueChange={(value) => handleNewVisitorChange("gender", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Not specified</SelectItem>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
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
                                            value={newVisitorForm.birthday}
                                            onChange={(e) => handleNewVisitorChange("birthday", e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="homeAddress">Home Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="homeAddress"
                                            value={newVisitorForm.homeAddress}
                                            onChange={(e) => handleNewVisitorChange("homeAddress", e.target.value)}
                                            placeholder="Enter home address"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="localGovernmentArea">Local Government Area</Label>
                                    <Input
                                        id="localGovernmentArea"
                                        value={newVisitorForm.localGovernmentArea}
                                        onChange={(e) => handleNewVisitorChange("localGovernmentArea", e.target.value)}
                                        placeholder="Enter LGA"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isBeliever"
                                        checked={newVisitorForm.isBeliever}
                                        onCheckedChange={(checked) => handleNewVisitorChange("isBeliever", checked)}
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
                                        value={newVisitorForm.howHeardAboutUs || "none"}
                                        onValueChange={(value) => handleNewVisitorChange("howHeardAboutUs", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select how they heard" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Select a source</SelectItem>
                                            <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                                            <SelectItem value="FRIEND_OR_FAMILY">Friend or Family</SelectItem>
                                            <SelectItem value="CHURCH_MEMBER">Church Member</SelectItem>
                                            <SelectItem value="FLYER_OR_BANNER">Flyer or Banner</SelectItem>
                                            <SelectItem value="WEBSITE">Website</SelectItem>
                                            <SelectItem value="WALK_IN">Walk-in</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="levelOfEducation">Education Level *</Label>
                                    <Select
                                        value={newVisitorForm.levelOfEducation || "none"}
                                        onValueChange={(value) => handleNewVisitorChange("levelOfEducation", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Select education level</SelectItem>
                                            <SelectItem value="NO_FORMAL_EDUCATION">No Formal Education</SelectItem>
                                            <SelectItem value="PRIMARY">Primary</SelectItem>
                                            <SelectItem value="SECONDARY">Secondary</SelectItem>
                                            <SelectItem value="TERTIARY">Tertiary</SelectItem>
                                            <SelectItem value="POSTGRADUATE">Postgraduate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serviceType">Service Type *</Label>
                                    <Select
                                        value={newVisitorForm.serviceType || "none"}
                                        onValueChange={(value) => handleNewVisitorChange("serviceType", value === "none" ? "" : value)}
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
                                        value={newVisitorForm.whatTheyLovedMost}
                                        onChange={(e) => handleNewVisitorChange("whatTheyLovedMost", e.target.value)}
                                        placeholder="e.g., The worship, message, hospitality"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="preferenceToReturn"
                                        checked={newVisitorForm.preferenceToReturn}
                                        onCheckedChange={(checked) => handleNewVisitorChange("preferenceToReturn", checked)}
                                    />
                                    <Label htmlFor="preferenceToReturn" className="cursor-pointer">Would Return</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={newVisitorForm.notes}
                                        onChange={(e) => handleNewVisitorChange("notes", e.target.value)}
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
                            Check-in Visitor
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}