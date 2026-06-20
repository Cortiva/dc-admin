import { useState } from "react";
import { Label } from "../../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { usersData } from "../../../mock/users";

interface LeaderPickerInlineFieldProps {
    label: string;
    leaderId: string;
    onChange: (leaderId: string) => void;
}

// NOTE: same caveat as LeaderPickerDialog — reuses mock users filtered to
// active accounts since there's no dedicated leader-search endpoint.
// A plain Select is enough here (vs. the full searchable dialog) because
// this lives inside a create form, not a "change leader" action — swap
// for an async-search combobox if the active user list grows large.
export function LeaderPickerInlineField({
    label,
    leaderId,
    onChange,
}: LeaderPickerInlineFieldProps) {
    const [activeUsers] = useState(() => usersData.filter((u) => u.status === "ACTIVE"));

    return (
        <div className="space-y-2">
            <Label htmlFor="leaderId">{label}</Label>
            <Select value={leaderId} onValueChange={onChange}>
                <SelectTrigger id="leaderId">
                    <SelectValue placeholder="Select a leader" />
                </SelectTrigger>
                <SelectContent>
                    {activeUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                            {user.fullName} — {user.email}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}