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
import SelfRegisterPage from "./modules/auth/pages/SelfRegisterPage";

// Auth
const LoginPage = lazy(() => import("./modules/auth/pages/LoginPage"));
const ForgotPassword = lazy(() => import("./modules/auth/pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./modules/auth/pages/VerifyOtp"));
const ResetPasswordPage = lazy(() => import("./modules/auth/pages/ResetPassword"));
const AcceptInvitePage = lazy(() => import("./modules/auth/pages/AcceptInvitePage"));

// Dashboard
const Dashboard = lazy(() => import("./modules/dashboard/pages/DashboardPage"));

// Users
const UsersPage = lazy(() => import("./modules/users/pages/UsersPage"));

// Members
const MemberListPage = lazy(() => import("./modules/members/pages/MemberListPage"));
const MemberDetailPage = lazy(() => import("./modules/members/pages/MemberDetailPage"));
const MemberFormPage = lazy(() => import("./modules/members/pages/MemberFormPage"));
const MemberStatsPage = lazy(() => import("./modules/members/pages/MemberStatsPage"));

// Structure
const AreasPage = lazy(() => import("./modules/structure/pages/AreasPage"));
const AreaDetailPage = lazy(() => import("./modules/structure/pages/AreaDetailPage"));
const ZoneDetailPage = lazy(() => import("./modules/structure/pages/ZoneDetailPage"));

// Visitors
const VisitorsPage = lazy(() => import("./modules/visitors/pages/VisitorsPage"));

// Notifications
const NotificationsPage = lazy(() => import("./modules/notification/pages/NotificationsPage"));

// Common
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
              {/* ─── AUTH ROUTES (only accessible when NOT logged in) ─── */}
              <Route element={<RedirectIfAuthenticated />}>
                <Route path="login" element={<AuthLayout><S><LoginPage /></S></AuthLayout>} />
                <Route path="forgot-password" element={<AuthLayout><S><ForgotPassword /></S></AuthLayout>} />
                <Route path="verify-otp" element={<AuthLayout><S><VerifyOtp /></S></AuthLayout>} />
                <Route path="reset-password" element={<AuthLayout><S><ResetPasswordPage /></S></AuthLayout>} />
                <Route path="self-register" element={<AuthLayout><S><SelfRegisterPage /></S></AuthLayout>} />
              </Route>

              <Route path="accept-invite" element={<AuthLayout><S><AcceptInvitePage /></S></AuthLayout>} />

              {/* ─── PROTECTED ROUTES (only accessible when logged in) ─── */}
              <Route element={<P><AppLayout /></P>}>
                {/* Dashboard */}
                <Route path="/" element={<S><Dashboard /></S>} />
                <Route path="/dashboard" element={<S><Dashboard /></S>} />

                {/* Users */}
                <Route path="/users" element={<S><UsersPage /></S>} />

                {/* Members */}
                <Route path="/members" element={<S><MemberListPage /></S>} />
                <Route path="/members/stats" element={<S><MemberStatsPage /></S>} />
                <Route path="/members/create" element={<S><MemberFormPage /></S>} />
                <Route path="/members/:id" element={<S><MemberDetailPage /></S>} />
                <Route path="/members/:id/edit" element={<S><MemberFormPage /></S>} />

                {/* Structure */}
                <Route path="/structure" element={<S><AreasPage /></S>} />
                <Route path="/structure/areas/:areaId" element={<S><AreaDetailPage /></S>} />
                <Route path="/structure/zones/:zoneId" element={<S><ZoneDetailPage /></S>} />

                {/* Visitors */}
                <Route path="/visitors" element={<S><VisitorsPage /></S>} />

                {/* Notifications */}
                <Route path="/system/notifications" element={<S><NotificationsPage /></S>} />

                {/* Unauthorized */}
                <Route path="/unauthorized" element={<S><Unauthorized /></S>} />
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