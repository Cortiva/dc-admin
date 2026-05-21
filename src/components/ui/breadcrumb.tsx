import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.path} className="flex items-center gap-1.5">
            {index !== 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            )}

            {isLast ? (
              <span className="font-medium text-foreground">
                {crumb.name.charAt(0).toUpperCase() + crumb.name.slice(1)}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-muted-foreground hover:text-foreground transition"
              >
                {crumb.name.charAt(0).toUpperCase() + crumb.name.slice(1)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}