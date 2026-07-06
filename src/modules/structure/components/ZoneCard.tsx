import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { ChevronRight, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ZoneResponse } from "../../../types/structure.types";

export function ZoneCard({ zone, cellCount }: { zone: ZoneResponse; cellCount?: number }) {
    const navigate = useNavigate();
    const initials = zone.leader
        ? `${zone.leader.firstName[0]}${zone.leader.lastName[0]}`.toUpperCase()
        : null;

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/structure/zones/${zone.id}`)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/structure/zones/${zone.id}`)}
            className="p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold truncate">{zone.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{zone.description}</p>
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
                        {zone.leader
                            ? `${zone.leader.firstName} ${zone.leader.lastName}`
                            : "No leader assigned"}
                    </span>
                </div>
                {cellCount !== undefined && (
                    <span className="text-xs text-muted-foreground shrink-0">
                        {cellCount} {cellCount === 1 ? "cell" : "cells"}
                    </span>
                )}
            </div>
        </Card>
    );
}