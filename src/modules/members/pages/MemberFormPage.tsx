import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { useCreateMemberMutation, useUpdateMemberMutation } from "../memberApiSlice";
import { handleApiError, validateEmail, validateNigerianPhone } from "../../../utils/functions";
import type { CreateMemberRequest, Gender, MemberResponse } from "../../../types/member.type";
import { apiSlice } from "../../../store/apiSlice";
import { ProfileImageUpload } from "../_components/ProfileImageUpload";

export default function MemberFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get member from route state
    const memberFromState = location.state?.member as MemberResponse | undefined;
    const isEdit = !!memberFromState;

    const [formData, setFormData] = useState({
        firstName: memberFromState?.firstName || "",
        lastName: memberFromState?.lastName || "",
        phone: memberFromState?.phone || "",
        email: memberFromState?.email || "",
        gender: memberFromState?.gender || "" as string,
        homeAddress: memberFromState?.homeAddress || "",
        localGovernmentArea: memberFromState?.localGovernmentArea || "",
        birthday: memberFromState?.birthday ? new Date(memberFromState.birthday).toISOString().split("T")[0] : "",
        isMarried: memberFromState?.isMarried || false,
        weddingDate: memberFromState?.weddingDate ? new Date(memberFromState.weddingDate).toISOString().split("T")[0] : "",
        profileImageUrl: memberFromState?.profileImageUrl || "",
        isBeliever: memberFromState?.isBeliever ?? true,
        attendedDCABasic: memberFromState?.attendedDCABasic || false,
        attendedDCAMerit: memberFromState?.attendedDCAMerit || false,
        attendedEncounter: memberFromState?.attendedEncounter || false,
        cellId: memberFromState?.cellId || "",
        departmentId: memberFromState?.departmentId || "",
    });

    // ─── Validation States ──────────────────────────────────────────────────

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
    const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();

    // Validate initial data from state
    useEffect(() => {
        if (memberFromState) {
            if (memberFromState.phone) {
                const result = validateNigerianPhone(memberFromState.phone);
                setIsPhoneValid(result.valid);
                if (!result.valid) setPhoneError(result.error || null);
            }
            if (memberFromState.email) {
                const result = validateEmail(memberFromState.email);
                setIsEmailValid(result);
                if (!result) setEmailError("Invalid email address");
            }
        }
    }, [memberFromState]);

    // ─── Handlers ──────────────────────────────────────────────────────────

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, phone: value }));
        setPhoneTouched(true);
        
        if (value.trim() === "") {
            setPhoneError("Phone number is required");
            setIsPhoneValid(false);
            return;
        }
        
        const result = validateNigerianPhone(value);
        if (!result.valid) {
            setPhoneError(result.error || null);
            setIsPhoneValid(false);
        } else {
            setPhoneError(null);
            setIsPhoneValid(true);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, email: value }));
        setEmailTouched(true);
        
        if (value.trim() === "") {
            setEmailError(null);
            setIsEmailValid(true);
            return;
        }
        
        const result = validateEmail(value);
        if (!result) {
            setEmailError("Invalid email address");
            setIsEmailValid(false);
        } else {
            setEmailError(null);
            setIsEmailValid(true);
        }
    };

    const refetchMembers = async () => {
        dispatch(
            apiSlice.util.invalidateTags(["Members"])
        );
    };

    // ─── Image Upload Handlers ─────────────────────────────────────────────

    const handleImageUpload = async (url: string) => {
        // Update form data with the new image URL
        setFormData(prev => ({ ...prev, profileImageUrl: url }));
        
        // If editing, update the member immediately
        if (isEdit && memberFromState) {
            try {
                await updateMember({ 
                    id: memberFromState.id, 
                    data: { profileImageUrl: url } 
                }).unwrap();
                toast.success('Profile image updated successfully');
                await refetchMembers();
            } catch (error) {
                handleApiError(error);
                // Revert form data on error
                setFormData(prev => ({ ...prev, profileImageUrl: memberFromState.profileImageUrl || "" }));
            }
        } else {
            toast.success('Image uploaded successfully');
        }
    };

    const handleImageRemove = async () => {
        // Update form data
        setFormData(prev => ({ ...prev, profileImageUrl: "" }));
        
        // If editing, remove the image from the member
        if (isEdit && memberFromState) {
            try {
                await updateMember({ 
                    id: memberFromState.id, 
                    data: { profileImageUrl: null } 
                }).unwrap();
                toast.success('Profile image removed');
                await refetchMembers();
            } catch (error) {
                handleApiError(error);
                // Revert form data on error
                setFormData(prev => ({ ...prev, profileImageUrl: memberFromState.profileImageUrl || "" }));
            }
        } else {
            toast.success('Image removed');
        }
    };

    // ─── Submit Handler ────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone before submit
        if (!formData.phone) {
            toast.error("Phone number is required");
            setPhoneError("Phone number is required");
            setPhoneTouched(true);
            return;
        }

        const phoneValidation = validateNigerianPhone(formData.phone);
        if (!phoneValidation.valid) {
            toast.error(phoneValidation.error || "Invalid phone number");
            setPhoneError(phoneValidation.error || null);
            setPhoneTouched(true);
            return;
        }

        // Validate email if provided
        if (formData.email) {
            const emailValidation = validateEmail(formData.email);
            if (!emailValidation) {
                toast.error("Invalid email address");
                setEmailError("Invalid email address");
                setEmailTouched(true);
                return;
            }
        }

        try {
            const submitData: CreateMemberRequest = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: phoneValidation.formatted || formData.phone,
                isBeliever: formData.isBeliever,
                attendedDCABasic: formData.attendedDCABasic,
                attendedDCAMerit: formData.attendedDCAMerit,
                attendedEncounter: formData.attendedEncounter,
                isMarried: formData.isMarried,
            };

            // Only include optional fields if they have values
            if (formData.email) {
                submitData.email = formData.email.trim();
            }
            if (formData.gender) {
                submitData.gender = formData.gender as Gender;
            }
            if (formData.homeAddress) {
                submitData.homeAddress = formData.homeAddress;
            }
            if (formData.localGovernmentArea) {
                submitData.localGovernmentArea = formData.localGovernmentArea;
            }
            if (formData.birthday) {
                submitData.birthday = new Date(formData.birthday);
            }
            if (formData.weddingDate) {
                submitData.weddingDate = new Date(formData.weddingDate);
            }
            if (formData.profileImageUrl) {
                submitData.profileImageUrl = formData.profileImageUrl;
            }
            if (formData.cellId) {
                submitData.cellId = formData.cellId;
            }
            if (formData.departmentId) {
                submitData.departmentId = formData.departmentId;
            }

            if (isEdit) {
                await updateMember({ id: memberFromState!.id, data: submitData }).unwrap();
                toast.success("Member updated successfully");
            } else {
                await createMember(submitData).unwrap();
                toast.success("Member created successfully");
            }

            await refetchMembers();
            navigate("/members");
        } catch (error) {
            handleApiError(error);
        }
    };

    // ─── Loading State ─────────────────────────────────────────────────────

    const isLoading = isCreating || isUpdating;
    const isFormValid = 
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        isPhoneValid &&
        (formData.email === "" || isEmailValid);

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/members")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title={isEdit ? "Edit Member" : "Add Member"}
                    subtitle={isEdit ? "Update member information" : "Create a new church member"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Personal Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                        </div>

                        {/* Profile Image Upload - Full width */}
                        <div className="md:col-span-2 flex justify-center py-4">
                            <ProfileImageUpload
                                currentImageUrl={formData.profileImageUrl}
                                onUploadSuccess={handleImageUpload}
                                onRemove={handleImageRemove}
                                size="lg"
                                uploadFolder="members"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                required
                                placeholder="Enter first name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                required
                                placeholder="Enter last name"
                            />
                        </div>

                        {/* Phone - with Nigerian validation */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    onBlur={() => setPhoneTouched(true)}
                                    required
                                    placeholder="e.g., 08012345678 or +2348012345678"
                                    className={`pl-10 ${phoneError && phoneTouched ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""} ${isPhoneValid && phoneTouched ? "border-green-500 focus:border-green-500 focus:ring-green-500/30" : ""}`}
                                />
                                {phoneTouched && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isPhoneValid ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : phoneError ? (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            {phoneError && phoneTouched && (
                                <p className="text-xs text-red-500">{phoneError}</p>
                            )}
                            {isPhoneValid && phoneTouched && (
                                <p className="text-xs text-green-600">✓ Valid Nigerian phone number</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)
                            </p>
                        </div>

                        {/* Email - with validation */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    onBlur={() => setEmailTouched(true)}
                                    placeholder="you@example.com"
                                    className={`pl-10 ${emailError && emailTouched ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""} ${isEmailValid && emailTouched && formData.email ? "border-green-500 focus:border-green-500 focus:ring-green-500/30" : ""}`}
                                />
                                {emailTouched && formData.email && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isEmailValid ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {emailError && emailTouched && (
                                <p className="text-xs text-red-500">{emailError}</p>
                            )}
                            {isEmailValid && emailTouched && formData.email && (
                                <p className="text-xs text-green-600">✓ Valid email address</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Optional - provide a valid email address
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={formData.gender || "not_specified"}
                                onValueChange={(value) => handleChange("gender", value === "not_specified" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_specified">Not specified</SelectItem>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birthday">Birthday</Label>
                            <Input
                                id="birthday"
                                type="date"
                                value={formData.birthday}
                                onChange={(e) => handleChange("birthday", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="homeAddress">Home Address</Label>
                            <Input
                                id="homeAddress"
                                value={formData.homeAddress}
                                onChange={(e) => handleChange("homeAddress", e.target.value)}
                                placeholder="Enter home address"
                            />
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

                        {/* Church Information */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold mb-4">Church Information</h3>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cellId">Cell</Label>
                            <Select
                                value={formData.cellId || "none"}
                                onValueChange={(value) => handleChange("cellId", value === "none" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cell" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No cell</SelectItem>
                                    {/* Cells will be populated from API */}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="departmentId">Department</Label>
                            <Select
                                value={formData.departmentId || "none"}
                                onValueChange={(value) => handleChange("departmentId", value === "none" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No department</SelectItem>
                                    {/* Departments will be populated from API */}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="isBeliever"
                                checked={formData.isBeliever}
                                onCheckedChange={(checked) => handleChange("isBeliever", checked)}
                            />
                            <Label htmlFor="isBeliever" className="cursor-pointer">Is a Believer</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="isMarried"
                                checked={formData.isMarried}
                                onCheckedChange={(checked) => handleChange("isMarried", checked)}
                            />
                            <Label htmlFor="isMarried" className="cursor-pointer">Is Married</Label>
                        </div>

                        {formData.isMarried && (
                            <div className="space-y-2">
                                <Label htmlFor="weddingDate">Wedding Date</Label>
                                <Input
                                    id="weddingDate"
                                    type="date"
                                    value={formData.weddingDate}
                                    onChange={(e) => handleChange("weddingDate", e.target.value)}
                                />
                            </div>
                        )}

                        {/* DCA Attendance */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold mb-4">Dominion City Academy</h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="attendedDCABasic"
                                checked={formData.attendedDCABasic}
                                onCheckedChange={(checked) => handleChange("attendedDCABasic", checked)}
                            />
                            <Label htmlFor="attendedDCABasic" className="cursor-pointer">DCA Basic</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="attendedDCAMerit"
                                checked={formData.attendedDCAMerit}
                                onCheckedChange={(checked) => handleChange("attendedDCAMerit", checked)}
                            />
                            <Label htmlFor="attendedDCAMerit" className="cursor-pointer">DCA Merit</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="attendedEncounter"
                                checked={formData.attendedEncounter}
                                onCheckedChange={(checked) => handleChange("attendedEncounter", checked)}
                            />
                            <Label htmlFor="attendedEncounter" className="cursor-pointer">Encounter</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/members")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !isFormValid}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update Member" : "Create Member"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}