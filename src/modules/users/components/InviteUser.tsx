import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../../../components/ui/dialog";
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
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import type { InviteUserRequest, UserRole } from "../types/user.types";
import { useInviteMemberMutation } from "../usersApiSlice";

interface InviteUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
];

const EMPTY_FORM: InviteUserRequest = {
    firstName: "",
    lastName: "",
    email: "",
    role: "USER",
};

export default function InviteUser({ isOpen, onClose, onSuccess }: InviteUserProps) {
    const [formData, setFormData] = useState<InviteUserRequest>(EMPTY_FORM);
    const [inviteMember, { isLoading }] = useInviteMemberMutation();

    const handleChange = <K extends keyof InviteUserRequest>(
        field: K,
        value: InviteUserRequest[K],
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setFormData(EMPTY_FORM);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inviteMember(formData).unwrap();
            toast.success(`Invite sent to ${formData.email}`);
            setFormData(EMPTY_FORM);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite a user</DialogTitle>
                    <DialogDescription>
                        They'll get an email with a link to set their password and join.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input
                                id="lastName"
                                required
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address *</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="john.doe@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => handleChange("role", value as UserRole)}
                        >
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Super Admin and Admin can manage members, users, and settings.
                        </p>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Sending invite..." : "Send invite"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}