// useBreadcrumbs.ts
import { useLocation } from "react-router-dom";
import { routes } from "../utils/routes";

export const useBreadcrumbs = () => {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter(Boolean);

    const breadcrumbs = pathnames.map((_, index) => {
        const path = "/" + pathnames.slice(0, index + 1).join("/");

        const route = routes.find((r) => {
            const routeParts = r.path.split("/");
            const pathParts = path.split("/");

            return (
                routeParts.length === pathParts.length &&
                routeParts.every(
                    (part, i) => part.startsWith(":") || part === pathParts[i],
                )
            );
        });

        return {
            name: route?.name || pathnames[index],
            path,
        };
    });

    // ✅ Handle root explicitly
    if (location.pathname === "/") {
        return [{ name: "Dashboard", path: "/" }];
    }

    return breadcrumbs;
};
