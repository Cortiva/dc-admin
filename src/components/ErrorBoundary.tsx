import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { ServerCrash, RefreshCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);

    // 👉 Optional: send to monitoring service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-6">
                <div className="relative w-full max-w-md text-center">
                    {/* subtle glow */}
                    <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-gradient-primary rounded-full" />

                    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                <ServerCrash className="h-8 w-8 text-destructive" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold font-heading mb-2">
                            Something went wrong
                        </h1>

                        {/* Message */}
                        <p className="text-muted-foreground mb-6">
                            An unexpected error occurred while loading this page. You can try
                            reloading or return to the dashboard.
                        </p>

                        {/* Error message (dev-friendly) */}
                        {this.state.error && (
                            <div className="mb-6 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground text-left break-words">
                                {this.state.error.message}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                variant="outline"
                                onClick={this.handleReload}
                                className="flex items-center gap-2"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Reload
                            </Button>

                            <Button
                                onClick={this.handleGoHome}
                                className="flex items-center gap-2"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return this.props.children;
    };
}

export default ErrorBoundary;