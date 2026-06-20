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
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Search, Check } from "lucide-react";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import { usersData } from "../../../mock/users";

interface LeaderPickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentLeaderId?: string | null;
    onAssign: (leaderId: string) => Promise<unknown>;
    targetLabel: string; // e.g. "Ijesha Zone" — used in confirmation copy
}

// NOTE: no dedicated "search leader candidates" endpoint was provided, so
// this reuses the Users mock data, filtered to active users — swap the
// usersData import for useFetchUsersQuery({ status: "ACTIVE", search })
// once a real endpoint exists.
export function LeaderPickerDialog({
    isOpen,
    onClose,
    currentLeaderId,
    onAssign,
    targetLabel,
}: LeaderPickerDialogProps) {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(currentLeaderId ?? null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const candidates = usersData
        .filter((u) => u.status === "ACTIVE")
        .filter((u) =>
            search
                ? u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase())
                : true,
        );

    const handleClose = () => {
        setSearch("");
        setSelectedId(currentLeaderId ?? null);
        onClose();
    };

    const handleConfirm = async () => {
        if (!selectedId) return;
        setIsSubmitting(true);
        try {
            await onAssign(selectedId);
            toast.success(`Leader updated for ${targetLabel}`);
            handleClose();
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign a leader</DialogTitle>
                    <DialogDescription>Choose who leads {targetLabel}.</DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="pl-9"
                        autoFocus
                    />
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 -mx-1 px-1">
                    {candidates.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No matching active users.
                        </p>
                    ) : (
                        candidates.map((user) => {
                            const isSelected = selectedId === user.id;
                            return (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => setSelectedId(user.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                                        isSelected
                                            ? "bg-primary/10 border border-primary/30"
                                            : "hover:bg-muted/50 border border-transparent"
                                    }`}
                                >
                                    <Avatar className="h-9 w-9 shrink-0">
                                        <AvatarFallback>
                                            {getInitials(user.firstName, user.lastName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{user.fullName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedId || isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save leader"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}