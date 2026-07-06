import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentAccessToken, selectCurrentUser } from "../modules/auth/authSlice";
import type { RootState } from "../store/rootReducer";

interface ProtectedRouteProps { 
    children: React.ReactNode;
}

export default function ProtectedRoute ({ children }: ProtectedRouteProps) {
    const token = useSelector(selectCurrentAccessToken);
    const user = useSelector(selectCurrentUser);
    const isHydrated = useSelector((state: RootState) => state.auth.isHydrated);
    const location = useLocation();

    // Wait for hydration
    if (!isHydrated) {
        return <div>Loading...</div>;
    }

    if (!token) {
        // Redirect to login but save the location they tried to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if ((user?.role !== "SUPER_ADMIN" && user?.role !== "ADMIN")) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If token exists, render the protected content
    return <>{children}</>;
};