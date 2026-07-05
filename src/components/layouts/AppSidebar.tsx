import {
    LayoutDashboard, Users,
    LogOut, ChevronDown, ChevronRight,
    UserPlus,
    MapPin,
    User,
    Building2,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../../modules/auth/authSlice";
import { SidebarHeader } from "../ui/sidebar";
import { useTheme } from "../../provider/theme-context";
import images from "../../utils/images";

type NavItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    badge?: number;
    roles?: string[];
    children?: ChildNavItem[];
};

type ChildNavItem = {
    title: string;
    url: string;
    icon?: React.ElementType;
};

type NavSection = {
    label: string;
    items: NavItem[];
};

const buildSections = (): NavSection[] => [
    {
        label: "Main",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "User Management",
        items: [
            { title: "Users", url: "/users", icon: Users },
            { title: "Visitors", url: "/visitors", icon: UserPlus },
        ],
    },
    {
        label: "Members",
        items: [
            {
                title: "Members",
                url: "/members",
                icon: User,
                children: [
                    { title: "All Members", url: "/members" },
                    { title: "Statistics", url: "/members/stats" },
                ],
            },
        ],
    },
    {
        label: "Church Structure",
        items: [
            {
                title: "Departments",
                url: "/departments",
                icon: Building2,
                children: [
                    { title: "All Departments", url: "/departments" },
                    { title: "Statistics", url: "/departments/stats" },
                ]
            },
            {
                title: "Areas",
                url: "/structure",
                icon: MapPin,
                children: [
                    { title: "All Areas", url: "/structure" },
                    { title: "Zones", url: "/structure/zones" },
                    { title: "Cells", url: "/structure/cells" },
                    { title: "Statistics", url: "/structure/stats" },
                ]
            },
        ],
    },
    // {
    //     label: "System",
    //     items: [
    //         { title: "Notifications", url: "/system/notifications", icon: Bell },
    //     ],
    // },
];

export default function AppSidebar({
    collapsed, mobileOpen, setMobileOpen,
}: {
    collapsed: boolean; mobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const role = user?.role ?? "";
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const sections = buildSections();

    // Helper function to check if an item or any of its children is active
    const isItemActive = (item: NavItem): boolean => {
        if (location.pathname === item.url) return true;
        if (item.children) {
            return item.children.some(child => 
                location.pathname === child.url || 
                location.pathname.startsWith(child.url + "/")
            );
        }
        return false;
    };

    // Dynamically determine which menu should be open based on current route
    const getExpandedState = () => {
        const expandedState: Record<string, boolean> = {};
        
        sections.forEach(section => {
            section.items.forEach(item => {
                if (item.children && isItemActive(item)) {
                    expandedState[item.url] = true;
                }
            });
        });
        
        return expandedState;
    };

    const [expanded, setExpanded] = useState<Record<string, boolean>>(getExpandedState());

    const isActive = (url: string) => {
        const current = location.pathname === "/" ? "/dashboard" : location.pathname;
        if (url === "/dashboard") return current === "/dashboard";
        return current === url || current.startsWith(url + "/");
    };

    const isActiveSection = (items: NavItem[]): boolean =>
        items.some((item) =>
            isActive(item.url) || (item.children ?? []).some((c) => isActive(c.url))
        );

    const handleLogout = () => { 
        dispatch(logout()); 
        navigate("/login"); 
    };

    const handleNavClick = (item: NavItem) => {
        if (item.children) {
            if (collapsed) {
                // If collapsed, navigate to the first child
                navigate(item.children[0].url);
            } else {
                // Toggle the clicked menu
                setExpanded((prev) => ({ ...prev, [item.url]: !prev[item.url] }));
            }
        } else {
            navigate(item.url);
            setMobileOpen(false);
        }
    };

    const handleChildClick = (url: string) => {
        navigate(url);
        setMobileOpen(false);
    };

    const filteredSections = sections
        .map((s) => ({ 
            ...s, 
            items: s.items.filter((i) => !i.roles || i.roles.includes(role)) 
        }))
        .filter((s) => s.items.length > 0);

    const renderItem = (item: NavItem, depth = 0) => {
        const active = isActive(item.url);
        const Icon = item.icon;
        const hasKids = !!item.children?.length;
        const isOpen = expanded[item.url];

        return (
            <div key={item.url}>
                <button
                    onClick={() => handleNavClick(item)}
                    title={collapsed && depth === 0 ? item.title : undefined}
                    className={`
                        relative flex items-center gap-3 px-3 py-2 rounded-sm w-full
                        transition-all duration-200 group cursor-pointer
                        ${depth > 0 ? "pl-7" : ""}
                        ${active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                        }
                        ${collapsed && depth === 0 ? "justify-center" : ""}
                    `}
                >
                    {active && <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-primary" />}

                    <Icon className={`shrink-0 transition-colors ${active ? "text-primary" : "group-hover:text-primary"} ${depth > 0 ? "h-4 w-4" : "h-4.5 w-4.5"}`} />

                    {(!collapsed || depth > 0) && (
                        <span className={`flex-1 text-left truncate ${depth > 0 ? "text-xs" : "text-sm"}`}>
                            {item.title}
                        </span>
                    )}

                    {item.badge != null && item.badge > 0 && (
                        <span className={`bg-red-500/10 text-red-600 font-bold rounded-full flex items-center justify-center px-1 ${
                            collapsed && depth === 0
                                ? "absolute top-1 right-1 min-w-3.5 h-3.5 text-[9px]"
                                : "ml-auto min-w-4.5 h-4.5 text-[10px]"
                        }`}>
                            {item.badge > 99 ? "99+" : item.badge}
                        </span>
                    )}

                    {hasKids && !collapsed && (
                        <span className="ml-auto text-sidebar-foreground/40 shrink-0">
                            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        </span>
                    )}
                </button>

                {hasKids && isOpen && !collapsed && (
                    <div className="mt-0.5 space-y-0.5">
                        {item.children!.map((child) => (
                            <button
                                key={child.url}
                                onClick={() => handleChildClick(child.url)}
                                className={`
                                    relative flex items-center gap-3 px-3 py-2 rounded-sm w-full
                                    transition-all duration-200 group cursor-pointer pl-7
                                    ${location.pathname === child.url
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                                    }
                                `}
                            >
                                {location.pathname === child.url && (
                                    <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-primary" />
                                )}
                                {child.icon && (
                                    <child.icon className="h-4 w-4 shrink-0 transition-colors" />
                                )}
                                <span className="flex-1 text-left truncate text-xs">
                                    {child.title}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className={`
            fixed top-0 left-0 z-50 h-screen
            bg-sidebar text-sidebar-foreground border-r border-sidebar-border
            flex flex-col transition-all duration-300
            ${collapsed ? "w-20" : "w-60"}
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
        `}>
            <div className="h-full flex flex-col">
                {/* Logo */}
                <SidebarHeader className="p-3 border-b border-sidebar-border">
                    <div className="flex items-center gap-2.5 px-1 py-0.5">
                        {collapsed ? (
                            <img src={isDark ? images.icon : images.icon} alt="logo" width={35} />
                        ) : (
                            <Link to="/" className="flex items-center gap-3">
                                <img src={isDark ? images.icon : images.icon} alt="Dominion City" width={35} />
                                <div className="flex flex-col">
                                    <h1 className="text-[17px] font-bold">Dominion City</h1>
                                    <p className="text-[14px] text-muted-foreground">Surulere</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </SidebarHeader>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
                    {filteredSections.map((section) => {
                        const sectionActive = isActiveSection(section.items);
                        return (
                            <div key={section.label} className={`space-y-0.5 rounded-md transition-all ${sectionActive ? "bg-sidebar-accent/5 border border-sidebar-accent/20 p-1" : ""}`}>
                                {!collapsed && (
                                    <p className={`px-3 py-1 text-[10px] uppercase tracking-wider ${sectionActive ? "text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground/50"}`}>
                                        {section.label}
                                    </p>
                                )}
                                <div className="space-y-0.5">{section.items.map((item) => renderItem(item))}</div>
                                {!collapsed && <div className="h-px bg-sidebar-border/40 mt-2 mx-1" />}
                            </div>
                        );
                    })}
                </div>

                {/* Logout */}
                <div className="p-3 border-t border-sidebar-border">
                    <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2 w-full rounded-md text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? "justify-center" : ""}`}>
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}