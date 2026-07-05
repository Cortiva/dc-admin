
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { useGetMembersQuery } from "../../members/memberApiSlice";
import { handleApiError } from "../../../utils/functions";
import { apiSlice } from "../../../store/apiSlice";
import type { UserResponse } from "../../../types/user.types";
import { useCreateUserMutation, useUpdateUserMutation } from "../usersApiSlice";
import type { RegistrationSource, UserRole, UserStatus } from "../types/user.types";

export default function UserFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userFromState = location.state?.user as UserResponse | undefined;
    const isEdit = !!userFromState;

    const [formData, setFormData] = useState({
        memberId: userFromState?.memberId || "",
        password: "",
        role: userFromState?.role || "USER",
        status: userFromState?.status || "PENDING_VERIFICATION",
        registrationSource: userFromState?.registrationSource || "SELF_REGISTERED",
    });

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const { data: members, isLoading: membersLoading } = useGetMembersQuery({ limit: 100 });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const refetchUsers = async () => {
        dispatch(apiSlice.util.invalidateTags(["Users"]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.memberId) {
            toast.error("Please select a member");
            return;
        }

        if (!isEdit && !formData.password) {
            toast.error("Password is required for new users");
            return;
        }

        try {
            if (isEdit) {
                await updateUser({
                    id: userFromState!.id,
                    data: {
                        role: formData.role as UserRole,
                        status: formData.status as UserStatus,
                    }
                }).unwrap();
                toast.success("User updated successfully");
            } else {
                await createUser({
                    memberId: formData.memberId,
                    password: formData.password,
                    role: formData.role as UserRole,
                    status: formData.status as UserStatus,
                    registrationSource: formData.registrationSource as RegistrationSource,
                }).unwrap();
                toast.success("User created successfully");
            }

            await refetchUsers();
            navigate("/users");
        } catch (error) {
            handleApiError(error);
        }
    };

    const isLoading = isCreating || isUpdating || membersLoading;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title={isEdit ? "Edit User" : "Add User"}
                    subtitle={isEdit ? "Update user information" : "Create a new user account"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {/* Member Selection */}
                        {!isEdit && (
                            <div className="space-y-2">
                                <Label htmlFor="memberId">Member *</Label>
                                <Select
                                    value={formData.memberId}
                                    onValueChange={(value) => handleChange("memberId", value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={membersLoading ? "Loading members..." : "Select a member"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members?.members?.map((member: { id: string; firstName: string; lastName: string; phone: string }) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.firstName} {member.lastName} - ({member.phone})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Select an existing member to create a user account for them
                                </p>
                            </div>
                        )}

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {isEdit ? "New Password" : "Password *"}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
                                required={!isEdit}
                                className="h-11"
                            />
                            {isEdit && (
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep current password
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => handleChange("role", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
                                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                    <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Registration Source */}
                        {!isEdit && (
                            <div className="space-y-2">
                                <Label htmlFor="registrationSource">Registration Source</Label>
                                <Select
                                    value={formData.registrationSource}
                                    onValueChange={(value) => handleChange("registrationSource", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SELF_REGISTERED">Self Registered</SelectItem>
                                        <SelectItem value="INVITED">Invited</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/users")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || (!isEdit && !formData.memberId)}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update User" : "Create User"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}