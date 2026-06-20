import { User as UserIcon, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import type { LeaderRef } from "../types/structure.types";

interface LeaderCardProps {
    leader: LeaderRef | null;
    onChangeLeader: () => void;
}

export function LeaderCard({ leader, onChangeLeader }: LeaderCardProps) {
    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-11 w-11 shrink-0">
                    {leader ? (
                        <AvatarFallback>
                            {getInitials(leader.firstName, leader.lastName)}
                        </AvatarFallback>
                    ) : (
                        <AvatarFallback>
                            <UserIcon className="w-5 h-5 text-muted-foreground" />
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Leader</p>
                    {leader ? (
                        <>
                            <p className="font-medium truncate">
                                {leader.firstName} {leader.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{leader.email}</p>
                        </>
                    ) : (
                        <p className="font-medium text-muted-foreground">No leader assigned</p>
                    )}
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={onChangeLeader} className="shrink-0">
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                {leader ? "Change" : "Assign"}
            </Button>
        </div>
    );
}