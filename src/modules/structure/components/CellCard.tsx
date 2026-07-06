import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Sprout } from "lucide-react";
import type { CellResponse } from "../../../types/structure.types";

interface CellCardProps {
    cell: CellResponse;
    onView: (cell: CellResponse) => void;
}

// Cells have no children, so this opens a detail modal on click rather
// than navigating to a fourth route level — unlike AreaCard/ZoneCard.
export function CellCard({ cell, onView }: CellCardProps) {
    const initials = cell.leader
        ? `${cell.leader.firstName[0]}${cell.leader.lastName[0]}`.toUpperCase()
        : null;

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={() => onView(cell)}
            onKeyDown={(e) => e.key === "Enter" && onView(cell)}
            className="p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                    <Sprout className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold truncate">{cell.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{cell.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted-card min-w-0">
                {initials ? (
                    <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
                    </Avatar>
                ) : null}
                <span className="text-sm text-muted-foreground truncate">
                    {cell.leader
                        ? `${cell.leader.firstName} ${cell.leader.lastName}`
                        : "No leader assigned"}
                </span>
            </div>
        </Card>
    );
}