// App.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./provider/ThemeProvider";
import { Toaster as Sonner } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lazy, Suspense } from "react";
import AppLayout from "./components/layouts/AppLayout";
import PageLoader from "./components/helper/PageLoader";
import AuthLayout from "./components/layouts/AuthLayout";

const LoginPage = lazy(() => import("./modules/auth/pages/LoginPage"));
const ForgotPassword = lazy(() => import("./modules/auth/pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./modules/auth/pages/VerifyOtp"));
const ResetPasswordPage = lazy(() => import("./modules/auth/pages/ResetPassword"));
const Dashboard = lazy(() => import("./modules/dashboard/pages/DashboardPage"));
const MembersPage = lazy(() => import("./modules/members/pages/MembersPage"));
const VisitorsPage = lazy(() => import("./modules/members/pages/VisitorsPage"));
const NotificationsPage = lazy(() => import("./modules/notification/pages/NotificationsPage"));
const Unauthorized = lazy(() => import("./modules/Unauthorized"));
const NotFound = lazy(() => import("./modules/NotFound"));

const queryClient = new QueryClient();

const S = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const P = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute><S>{children}</S></ProtectedRoute>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
            <ToastContainer position="bottom-center" autoClose={5000} className="bg-card text-foreground" />
            <Sonner />
            <Routes>
              {/* AUTH ROUTES (only accessible when NOT logged in) */}
              <Route element={<RedirectIfAuthenticated />}>
                <Route path="login" element={ <AuthLayout><S><LoginPage /></S></AuthLayout>}/>
                <Route path="forgot-password" element={ <AuthLayout><S><ForgotPassword /></S></AuthLayout>}/>
                <Route path="verify-otp" element={ <AuthLayout><S><VerifyOtp /></S></AuthLayout>}/>
                <Route path="reset-password" element={ <AuthLayout><S><ResetPasswordPage /></S></AuthLayout>}/>
              </Route>

            {/* PROTECTED ROUTES (only accessible when logged in) */}
            <Route element={<P><AppLayout /></P>}>
              <Route path="/" element={ <S><Dashboard /></S>}/>
              <Route path="/dashboard" element={ <S><Dashboard /></S>}/>
              <Route path="/members" element={ <S><MembersPage /></S>}/>
              <Route path="/visitors" element={ <S><VisitorsPage /></S>}/>
              {/* <Route path="/system/audit" element={ <S><SystemAuditLogsPage /></S>}/> */}
              <Route path="/system/notifications" element={<S><NotificationsPage /></S>} />
              <Route path="/unauthorized"  element={<S><Unauthorized /></S>} />
              </Route>

              {/* 404 - Not Found */} 
              <Route path="*" element={<NotFound />} />
            </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;