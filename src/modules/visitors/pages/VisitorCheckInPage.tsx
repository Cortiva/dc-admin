import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
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

export default function VisitorCheckInPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const existingVisitor = location.state?.visitor as VisitorProfileResponse | undefined;
    
    const [formData, setFormData] = useState({
        memberId: existingVisitor?.memberId || "",
        firstName: existingVisitor?.member.firstName || "",
        lastName: existingVisitor?.member.lastName || "",
        phone: existingVisitor?.member.phone || "",
        email: existingVisitor?.member.email || "",
        gender: existingVisitor?.member.gender || "",
        homeAddress: "",
        localGovernmentArea: "",
        birthday: "",
        isBeliever: false,
        howHeardAboutUs: "",
        levelOfEducation: "",
        preferenceToReturn: false,
        whatTheyLovedMost: "",
        serviceType: "",
        notes: "",
        recordedById: "system",
    });

    const [phoneError, setPhoneError] = useState<string | null>(null);
    // const [isPhoneValid, setIsPhoneValid] = useState(false);
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
            // setIsPhoneValid(false);
            return;
        }
        
        const result = validateNigerianPhone(value);
        if (!result.valid) {
            setPhoneError(result.error || null);
            // setIsPhoneValid(false);
        } else {
            setPhoneError(null);
            // setIsPhoneValid(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                recordedById: formData.recordedById,
            }).unwrap();

            toast.success("Visitor checked in successfully!");
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
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleChange("gender", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Not specified</SelectItem>
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
                                            value={formData.birthday}
                                            onChange={(e) => handleChange("birthday", e.target.value)}
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
                                            value={formData.homeAddress}
                                            onChange={(e) => handleChange("homeAddress", e.target.value)}
                                            placeholder="Enter home address"
                                            className="pl-10"
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
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="isBeliever"
                                        checked={formData.isBeliever}
                                        onCheckedChange={(checked) => handleChange("isBeliever", checked)}
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
                                        value={formData.howHeardAboutUs}
                                        onValueChange={(value) => handleChange("howHeardAboutUs", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select how they heard" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                        value={formData.levelOfEducation}
                                        onValueChange={(value) => handleChange("levelOfEducation", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                        value={formData.serviceType}
                                        onValueChange={(value) => handleChange("serviceType", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select service type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUNDAY_SERVICE">Sunday Service</SelectItem>
                                            <SelectItem value="MIDWEEK_SERVICE">Midweek Service</SelectItem>
                                            <SelectItem value="SPECIAL_EVENT">Special Event</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
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
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {existingVisitor ? "Record Visit" : "Check-in Visitor"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}