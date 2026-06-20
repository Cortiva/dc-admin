import { useState, useEffect } from "react";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../components/ui/popover";
import { Search, Check, ChevronDown, Loader2 } from "lucide-react";
import type { User } from "../types/user.types";
import { useFetchUsersQuery } from "../usersApiSlice";

interface LeaderPickerInlineFieldProps {
    label: string;
    leaderId: string;
    onChange: (leaderId: string) => void;
}

export function LeaderPickerInlineField({
    label,
    leaderId,
    onChange,
}: LeaderPickerInlineFieldProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(handle);
    }, [search]);

    const { data: usersResponse, isFetching } = useFetchUsersQuery(
        { page: 1, limit: 20, status: "ACTIVE", search: debouncedSearch },
        { skip: !open },
    );
    const candidates = usersResponse?.data.content ?? [];

    const handleSelect = (user: User) => {
        setSelectedUser(user);
        onChange(user.id);
        setOpen(false);
        setSearch("");
    };

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between font-normal"
                    >
                        {selectedUser ? (
                            <span className="flex items-center gap-2 min-w-0">
                                <Avatar className="h-5 w-5 shrink-0">
                                    <AvatarFallback className="text-[9px]">
                                        {getInitials(selectedUser.firstName, selectedUser.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{selectedUser.fullName}</span>
                            </span>
                        ) : leaderId ? (
                            <span className="text-muted-foreground">Leader selected</span>
                        ) : (
                            <span className="text-muted-foreground">Select a leader</span>
                        )}
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 space-y-2" align="start">
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
                    <div className="max-h-64 overflow-y-auto space-y-1">
                        {isFetching ? (
                            <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Loading...
                            </div>
                        ) : candidates.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No matching active users.
                            </p>
                        ) : (
                            candidates.map((user) => {
                                const isSelected = leaderId === user.id;
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => handleSelect(user)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                                            isSelected
                                                ? "bg-primary/10 border border-primary/30"
                                                : "hover:bg-muted/50 border border-transparent"
                                        }`}
                                    >
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(user.firstName, user.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{user.fullName}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}