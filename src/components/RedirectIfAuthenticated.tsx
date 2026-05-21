import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentAccessToken } from "../modules/auth/authSlice";

const RedirectIfAuthenticated = () => {
    const token = useSelector(selectCurrentAccessToken);
    
    // If token exists, redirect to home
    if (token) {
        return <Navigate to="/" replace />;
    }
    
    // If no token, show auth pages (login, register, etc.)
    return <Outlet />;
};

export default RedirectIfAuthenticated;