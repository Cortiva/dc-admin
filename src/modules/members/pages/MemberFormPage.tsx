import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Skeleton } from "../../../components/ui/skeleton";
import { useCreateMemberMutation, useGetMemberByIdQuery, useUpdateMemberMutation } from "../memberApiSlice";
import { handleApiError } from "../../../utils/functions";

export default function MemberFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        gender: "",
        homeAddress: "",
        localGovernmentArea: "",
        birthday: "",
        isMarried: false,
        weddingDate: "",
        profileImageUrl: "",
        isBeliever: true,
        attendedDCABasic: false,
        attendedDCAMerit: false,
        attendedEncounter: false,
        cellId: "",
        departmentId: "",
    });

    const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
    const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
    const { data: member, isLoading: isLoadingMember } = useGetMemberByIdQuery(id!, { skip: !id });

    useEffect(() => {
        if (member) {
            setFormData({
                firstName: member.firstName,
                lastName: member.lastName,
                phone: member.phone,
                email: member.email || "",
                gender: member.gender || "",
                homeAddress: member.homeAddress || "",
                localGovernmentArea: member.localGovernmentArea || "",
                birthday: member.birthday ? new Date(member.birthday).toISOString().split("T")[0] : "",
                isMarried: member.isMarried,
                weddingDate: member.weddingDate ? new Date(member.weddingDate).toISOString().split("T")[0] : "",
                profileImageUrl: member.profileImageUrl || "",
                isBeliever: member.isBeliever,
                attendedDCABasic: member.attendedDCABasic,
                attendedDCAMerit: member.attendedDCAMerit,
                attendedEncounter: member.attendedEncounter,
                cellId: member.cellId || "",
                departmentId: member.departmentId || "",
            });
        }
    }, [member]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateMember({ id: id!, data: formData }).unwrap();
                toast.success("Member updated successfully");
            } else {
                await createMember(formData).unwrap();
                toast.success("Member created successfully");
            }
            navigate("/members");
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isEdit && isLoadingMember) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-32" />
                <Card className="p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    const isLoading = isCreating || isUpdating;

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

                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
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
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="localGovernmentArea">Local Government Area</Label>
                            <Input
                                id="localGovernmentArea"
                                value={formData.localGovernmentArea}
                                onChange={(e) => handleChange("localGovernmentArea", e.target.value)}
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
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update Member" : "Create Member"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}