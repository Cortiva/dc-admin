import { useEffect, useState } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    /**
     * Close mobile sidebar on resize to desktop
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /**
     * Prevent body scroll when mobile sidebar is open
     */
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [mobileOpen]);

    return (
        <div className="h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <AppSidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Overlay (mobile only) */}
            {mobileOpen && (
                <div
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main Wrapper */}
            <div
                className={`flex flex-col h-full transition-all duration-300
                ${collapsed ? "md:ml-20" : "md:ml-60"}
            `}
            >
                {/* Header */}
                <AppHeader
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-5 py-5">
                    {children}
                </main>
            </div>
        </div>
    );
}