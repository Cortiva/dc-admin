import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Area } from "../types/structure.types";

export function AreaCard({ area, zoneCount }: { area: Area; zoneCount?: number }) {
    const navigate = useNavigate();
    const initials = area.leader
        ? `${area.leader.firstName[0]}${area.leader.lastName[0]}`.toUpperCase()
        : null;

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/structure/areas/${area.id}`)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/structure/areas/${area.id}`)}
            className="p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold truncate">{area.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{area.description}</p>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-muted-card">
                <div className="flex items-center gap-2 min-w-0">
                    {initials ? (
                        <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
                        </Avatar>
                    ) : null}
                    <span className="text-sm text-muted-foreground truncate">
                        {area.leader
                            ? `${area.leader.firstName} ${area.leader.lastName}`
                            : "No leader assigned"}
                    </span>
                </div>
                {zoneCount !== undefined && (
                    <span className="text-xs text-muted-foreground shrink-0">
                        {zoneCount} {zoneCount === 1 ? "zone" : "zones"}
                    </span>
                )}
            </div>
        </Card>
    );
}