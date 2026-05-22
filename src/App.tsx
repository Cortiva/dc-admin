// App.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./provider/ThemeProvider";
import { Toaster as Sonner } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./modules/auth/LoginPage";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import AuthLayout from "./components/layouts/AuthLayout";
import VerifyOtp from "./modules/auth/VerifyOtp";
import ForgotPassword from "./modules/auth/ForgotPassword";
import ResetPasswordPage from "./modules/auth/ResetPassword";
import Dashboard from "./modules/dashboard/DashboardPage";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import NotFound from "./modules/NotFound";
// import SystemAuditLogsPage from "./modules/users/SystemAuditLogs";
import MembersPage from "./modules/members/MembersPage";
import VisitorsPage from "./modules/members/VisitorsPage";
import NotificationsPage from "./modules/notification/NotificationsPage";
// import ChatPage from "./modules/chat/ChatPage";

const queryClient = new QueryClient();

const A = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
            <ToastContainer position="bottom-center" autoClose={5000} />
            <Sonner />
            <Routes>
              {/* AUTH ROUTES (only accessible when NOT logged in) */}
              <Route element={<RedirectIfAuthenticated />}>
                <Route path="login" element={ <AuthLayout><LoginPage /></AuthLayout>}/>
                <Route path="forgot-password" element={ <AuthLayout><ForgotPassword /></AuthLayout>}/>
                <Route path="verify-otp" element={ <AuthLayout><VerifyOtp /></AuthLayout>}/>
                <Route path="reset-password" element={ <AuthLayout><ResetPasswordPage /></AuthLayout>}/>
              </Route>

              {/* PROTECTED ROUTES (only accessible when logged in) */}
              <Route path="/" element={ <A><Dashboard /></A>}/>
              <Route path="/dashboard" element={ <A><Dashboard /></A>}/>
              <Route path="/members" element={ <A><MembersPage /></A>}/>
              <Route path="/visitors" element={ <A><VisitorsPage /></A>}/>
              {/* <Route path="/system/audit" element={ <A><SystemAuditLogsPage /></A>}/> */}
              <Route path="/system/notifications" element={ <A><NotificationsPage /></A>}/>

              {/* 404 - Not Found */} 
              <Route path="*" element={<NotFound />} />
            </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;