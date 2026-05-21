import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Frown, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="relative w-full max-w-md text-center">
                {/* subtle glow */}
                <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-primary rounded-full" />

                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Frown className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold font-heading mb-2">404</h1>

                    {/* Message */}
                    <p className="text-muted-foreground mb-6">
                        The page you’re looking for doesn’t exist or may have been moved.
                    </p>

                    {/* Path (helpful for debugging in admin apps) */}
                    <div className="mb-6 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                        {location.pathname}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;