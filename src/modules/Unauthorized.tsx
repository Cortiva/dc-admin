import { useNavigate } from "react-router-dom";
import { ShieldOff, ArrowLeft, Home } from "lucide-react";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            {/* Icon */}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
                    <ShieldOff size={36} className="text-red-500" />
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-2 rounded-3xl border-2 border-dashed border-red-200 dark:border-red-900" />
            </div>

            {/* Copy */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
                Access denied
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
                You don't have permission to view this page. If you think this
                is a mistake, contact your system administrator.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-sm hover:bg-accent text-foreground transition-colors"
                >
                    <ArrowLeft size={15} />
                    Go back
                </button>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-sm transition-colors"
                >
                    <Home size={15} />
                    Dashboard
                </button>
            </div>
        </div>
    );
}