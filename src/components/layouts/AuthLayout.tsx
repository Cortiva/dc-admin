import { Moon, Sun, Users, UserPlus, Church, HandHeart } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../provider/theme-context";
import images from "../../utils/images";

export default function AuthLayout({ children }: { children: ReactNode }) { 
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="relative flex min-h-screen">
            {/* Left Panel - Branding */}
            <div className="relative hidden w-1/2 overflow-hidden lg:flex">
                <div className="absolute inset-0 bg-gradient-hero" />
                
                <div className="relative z-10 flex flex-col justify-between p-12">
                    <div>
                        <Link to="/" className="flex items-center gap-3">
                            <img src={isDark ? images.icon : images.icon} alt="Dominion City" width={60} />
                            <div className="flex flex-col">
                                <h1 className="text-[35px] font-bold">Dominion City</h1>
                                <p className="text-[13px] text-muted-foreground">Raising leaders that transform society</p>
                            </div>
                        </Link>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold font-heading leading-tight xl:text-5xl">
                                The Core of a<br />
                                <span className="text-gradient">Thriving Church</span> 
                            </h1>
                            <p className="max-w-xl text-lg">
                                Manage members, track attendance, oversee ministries, and handle church operations from one centralized admin dashboard.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    icon: Users,
                                    title: "Member Management",
                                    description: "Track members, families, and contact info",
                                },
                                {
                                    icon: UserPlus,
                                    title: "Visitor Tracking",
                                    description: "Follow up on first-time visitors",
                                },
                                {
                                    icon: Church,
                                    title: "Ministry Oversight",
                                    description: "Manage departments and volunteer teams",
                                },
                                {
                                    icon: HandHeart,
                                    title: "Giving & Tithes",
                                    description: "Track offerings, pledges, and donations",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-xl bg-background p-5 backdrop-blur-sm border border-border hover:shadow-glow transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="text-sm font-semibold font-heading">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Dominion City Surulere. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex w-full flex-col bg-background lg:w-1/2">
                <div className="flex items-center justify-between p-6">
                    <Link to="/" className="flex items-center gap-2 lg:hidden">
                        <img src={isDark ? images.icon : images.icon} alt="Dominion City" width={140} />
                    </Link>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center px-6 pb-12">
                    {children}
                </div>
            </div>
        </div>
    );
};