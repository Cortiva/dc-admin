import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Crumb {
    label: string;
    to?: string; // omit on the last (current) crumb
}

export function StructureBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                    <span key={i} className="flex items-center gap-1.5">
                        {crumb.to && !isLast ? (
                            <Link to={crumb.to} className="hover:text-foreground hover:underline">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-foreground font-medium" : ""}>
                                {crumb.label}
                            </span>
                        )}
                        {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                );
            })}
        </nav>
    );
}