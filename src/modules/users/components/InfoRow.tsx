import type { ReactNode } from "react";

interface InfoRowsProps {
    icon: ReactNode;
    label: string;
    value: ReactNode;
}

// Standalone copy local to the users module. The members module has its
// own InfoRow/InfoRows component (imported in ViewMember.tsx) but its
// export shape wasn't in the files shared, so rather than guess at an
// import that might not match, this defines an equivalent locally. If
// the members InfoRows is exported the same way, feel free to delete
// this file and point ViewUser.tsx at the shared one instead.
export function InfoRows({ icon, label, value }: InfoRowsProps) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="text-sm font-medium break-words">{value}</div>
            </div>
        </div>
    );
}