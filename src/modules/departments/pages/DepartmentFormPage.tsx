import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import {
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useGetDepartmentsQuery,
} from "../departmentApiSlice";
import { handleApiError } from "../../../utils/functions";
import { apiSlice } from "../../../store/apiSlice";
import type { DepartmentResponse } from "../../../types/department.types";
import type { MemberResponse } from "../../../types/member.type";
import { useGetMembersQuery } from "../../members/memberApiSlice";

// Color options
const COLOR_OPTIONS = [
    { value: "#6C5CE7", label: "Purple" },
    { value: "#00A86B", label: "Green" },
    { value: "#FF6B35", label: "Orange" },
    { value: "#17A2B8", label: "Teal" },
    { value: "#FFC107", label: "Yellow" },
    { value: "#FD79A8", label: "Pink" },
    { value: "#00CEC9", label: "Cyan" },
    { value: "#FDCB6E", label: "Gold" },
    { value: "#E17055", label: "Red" },
    { value: "#0984E3", label: "Blue" },
];

// Icon options
const ICON_OPTIONS = [
    { value: "🎯", label: "Target" },
    { value: "📚", label: "Book" },
    { value: "🎵", label: "Music" },
    { value: "🙏", label: "Prayer" },
    { value: "❤️", label: "Heart" },
    { value: "⭐", label: "Star" },
    { value: "🎤", label: "Mic" },
    { value: "🏛️", label: "Building" },
    { value: "👨‍👩‍👧‍👦", label: "Family" },
    { value: "📖", label: "Bible" },
    { value: "🕊️", label: "Dove" },
    { value: "🔥", label: "Fire" },
];

export default function DepartmentFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const departmentFromState = location.state?.department as DepartmentResponse | undefined;
    const isEdit = !!departmentFromState;

    const [formData, setFormData] = useState({
        name: departmentFromState?.name || "",
        description: departmentFromState?.description || "",
        leaderId: departmentFromState?.leaderId || "",
        parentDepartmentId: departmentFromState?.parentDepartmentId || "",
        color: departmentFromState?.color || "#6C5CE7",
        icon: departmentFromState?.icon || "🎯",
        isActive: departmentFromState?.isActive ?? true,
    });

    const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
    const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

    const { data: departmentsData } = useGetDepartmentsQuery({
        limit: 100,
        isActive: true,
    });

    const { data: membersData } = useGetMembersQuery({
        limit: 100,
        isFullMember: true,
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const refetchDepartments = async () => {
        dispatch(apiSlice.util.invalidateTags(["Departments"]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Department name is required");
            return;
        }

        try {
            const data = {
                name: formData.name.trim(),
                description: formData.description || undefined,
                leaderId: formData.leaderId || undefined,
                parentDepartmentId: formData.parentDepartmentId || undefined,
                color: formData.color || undefined,
                icon: formData.icon || undefined,
                isActive: formData.isActive,
            };

            if (isEdit) {
                await updateDepartment({
                    id: departmentFromState!.id,
                    data,
                }).unwrap();
                toast.success("Department updated successfully");
            } else {
                await createDepartment(data).unwrap();
                toast.success("Department created successfully");
            }

            await refetchDepartments();
            navigate("/departments");
        } catch (error) {
            handleApiError(error);
        }
    };

    const isLoading = isCreating || isUpdating;

    // Filter out current department from parent options
    const parentOptions = departmentsData?.departments.filter(
        (d: DepartmentResponse) => !isEdit || d.id !== departmentFromState?.id
    ) || [];

    // Filter out already assigned leaders
    const leaderOptions = membersData?.members || [];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/departments")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title={isEdit ? "Edit Department" : "Add Department"}
                    subtitle={isEdit ? "Update department information" : "Create a new church department"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Department Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                placeholder="Enter department name"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Enter department description"
                                rows={4}
                            />
                        </div>

                        {/* Leader */}
                        <div className="space-y-2">
                            <Label>Department Leader</Label>
                            <Select
                                value={formData.leaderId || "none"}
                                onValueChange={(value) => handleChange("leaderId", value === "none" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a leader..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No leader assigned</SelectItem>
                                    {leaderOptions.map((member: MemberResponse) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            {member.firstName} {member.lastName} ({member.phone})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Parent Department */}
                        <div className="space-y-2">
                            <Label>Parent Department</Label>
                            <Select
                                value={formData.parentDepartmentId || "none"}
                                onValueChange={(value) => handleChange("parentDepartmentId", value === "none" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent department..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Root Department</SelectItem>
                                    {parentOptions.map((dept: DepartmentResponse) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                <Layers className="w-3 h-3 inline mr-1" />
                                Sub-departments inherit from parent departments
                            </p>
                        </div>

                        {/* Color & Icon */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Select
                                    value={formData.color}
                                    onValueChange={(value) => handleChange("color", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select color..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLOR_OPTIONS.map((color) => (
                                            <SelectItem key={color.value} value={color.value}>
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-4 h-4 rounded-full" 
                                                        style={{ backgroundColor: color.value }}
                                                    />
                                                    {color.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Icon</Label>
                                <Select
                                    value={formData.icon}
                                    onValueChange={(value) => handleChange("icon", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select icon..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ICON_OPTIONS.map((icon) => (
                                            <SelectItem key={icon.value} value={icon.value}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{icon.value}</span>
                                                    {icon.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Status */}
                        {isEdit && (
                            <div className="flex items-center justify-between p-3 rounded-lg border border-muted/30">
                                <div className="space-y-0.5">
                                    <Label>Active Status</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Inactive departments won't appear in most lists
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/departments")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name.trim()}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update Department" : "Create Department"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}