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
import AreaFormPage from "./modules/structure/pages/AreaFormPage";
import ZonesPage from "./modules/structure/pages/ZonesPage";
import ZoneFormPage from "./modules/structure/pages/ZoneFormPage";
import CellsPage from "./modules/structure/pages/CellsPage";
import CellDetailPage from "./modules/structure/pages/CellDetailPage";
import StructureStatsPage from "./modules/structure/pages/StructureStatsPage";
import CellFormPage from "./modules/structure/pages/CellFormPage";

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

const AreasPage = lazy(() => import("./modules/structure/pages/AreasPage"));
const AreaDetailPage = lazy(() => import("./modules/structure/pages/AreaDetailPage"));
const ZoneDetailPage = lazy(() => import("./modules/structure/pages/ZoneDetailPage"));

// Visitors
const VisitorsPage = lazy(() => import("./modules/visitors/pages/VisitorsPage"));

// Notifications
const NotificationsPage = lazy(() => import("./modules/notification/pages/NotificationsPage"));

const DepartmentListPage = lazy(() => import( "./modules/departments/pages/DepartmentListPage"));
const DepartmentFormPage = lazy(() => import( "./modules/departments/pages/DepartmentFormPage"));
const DepartmentDetailPage = lazy(() => import( "./modules/departments/pages/DepartmentDetailPage"));
const DepartmentStatsPage = lazy(() => import( "./modules/departments/pages/DepartmentStatsPage"));

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
              <Route path="/members/view" element={<S><MemberDetailPage /></S>} />
              <Route path="/members/edit" element={<S><MemberFormPage /></S>} />
              <Route path="/members/promote" element={<S><MemberDetailPage /></S>} />
              
              {/* Departments */}
              <Route path="/departments" element={<S><DepartmentListPage /></S>} />
              <Route path="/departments/stats" element={<S><DepartmentStatsPage /></S>} />
              <Route path="/departments/create" element={<S><DepartmentFormPage /></S>} />
              <Route path="/departments/view" element={<S><DepartmentDetailPage /></S>} />
              <Route path="/departments/edit" element={<S><DepartmentFormPage /></S>} />

              {/* Structure */}
              <Route path="/structure" element={<S><AreasPage /></S>} />
              <Route path="/structure/areas/create" element={<S><AreaFormPage /></S>} />
              <Route path="/structure/areas/view" element={<S><AreaDetailPage /></S>} />
              <Route path="/structure/areas/edit" element={<S><AreaFormPage /></S>} />

              <Route path="/structure/zones" element={<S><ZonesPage /></S>} />
              <Route path="/structure/zones/create" element={<S><ZoneFormPage /></S>} />
              <Route path="/structure/zones/view" element={<S><ZoneDetailPage /></S>} />
              <Route path="/structure/zones/edit" element={<S><ZoneFormPage /></S>} />

              <Route path="/structure/cells" element={<S><CellsPage /></S>} />
              <Route path="/structure/cells/create" element={<S><CellFormPage /></S>} />
              <Route path="/structure/cells/view" element={<S><CellDetailPage /></S>} />
              <Route path="/structure/cells/edit" element={<S><CellFormPage /></S>} />

              <Route path="/structure/stats" element={<S><StructureStatsPage /></S>} />

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