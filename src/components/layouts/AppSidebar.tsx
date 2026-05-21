import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  ShieldAlert,
  DollarSign,
  BarChart3,
  Layers,
  // MessageSquare,
  Megaphone,
  // Settings,
  Smartphone,
  Database,
  // Bell,
  LogOut,
  Gift,
  // ScanHeart,
} from "lucide-react";

import { NavLink } from "../NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../modules/auth/authSlice";
import { SidebarHeader } from "../ui/sidebar";
import images from "../../utils/images";
import { useTheme } from "../../provider/theme-context";

type SidebarSection = {
  label: string;
  items: { title: string; url: string; icon: React.ElementType }[];
};

const sections: SidebarSection[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      // { title: "Live Activity", url: "/activity", icon: Bell },
      // { title: "System Health", url: "/data/health", icon: ScanHeart },
    ],
  },

  {
    label: "Users & Verification",
    items: [
      { title: "All Users", url: "/users", icon: Users },
      { title: "Artisan Verification", url: "/verification", icon: UserCheck },
      { title: "Blacklisted Users", url: "/users/blacklisted", icon: ShieldAlert },
    ],
  },

  {
    label: "Jobs & Disputes",
    items: [
      { title: "Service Categories", url: "/categories", icon: Layers },
      { title: "Job Monitoring", url: "/jobs", icon: Briefcase },
    ],
  },

  {
    label: "Finance",
    items: [
      { title: "Revenue Dashboard", url: "/finance/revenue", icon: DollarSign },
      // { title: "Payouts", url: "/finance/payouts", icon: DollarSign },
      // { title: "Refunds", url: "/finance/refunds", icon: DollarSign },
    ],
  },

  {
    label: "Analytics",
    items: [
      { title: "Reports & Insights", url: "/analytics", icon: BarChart3 },
    ],
  },

  {
    label: "Communication",
    items: [
      // { title: "Chat", url: "/chat", icon: MessageSquare },
      // { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Broadcast", url: "/broadcast", icon: Megaphone },
      { title: "Disputes", url: "/disputes", icon: ShieldAlert },
    ],
  },

  {
    label: "Growth & Promotions",
    items: [
      // { title: "Promo Codes", url: "/promotions/codes", icon: Megaphone },
      { title: "Referrals", url: "/promotions/referrals", icon: Gift },
    ],
  },

  {
    label: "System",
    items: [
      // { title: "System Config", url: "/system/config", icon: Settings },
      // { title: "Feature Flags", url: "/system/flags", icon: Settings },
      { title: "Audit Logs", url: "/system/audit", icon: ShieldAlert },
    ],
  },

  {
    label: "Mobile App",
    items: [
      { title: "App Management", url: "/mobile", icon: Smartphone },
      { title: "Crash Analytics", url: "/mobile/crashes", icon: BarChart3 },
    ],
  },

  {
    label: "Data Management",
    items: [
      { title: "Data Export", url: "/data/export", icon: Database },
      { title: "Backups", url: "/data/backups", icon: Database },
    ],
  },
];

export default function AppSidebar({
    collapsed,
    mobileOpen,
}: {
    collapsed: boolean;
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const { theme } = useTheme();
  const isDark = theme === "dark";

  const isActive = (path: string) => {
    const currentPath =
      location.pathname === "/" ? "/dashboard" : location.pathname;

    if (path === "/dashboard") {
      return currentPath === "/dashboard";
    }

    return (
      currentPath === path ||
      currentPath.startsWith(path + "/")
    );
  };

    const sectionHasActive = (items: { url: string }[]) =>
        items.some((item) => isActive(item.url));

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

  return (
    <>
      <aside
      className={`
        fixed top-0 left-0 z-50 h-screen bg-sidebar text-sidebar-foreground border-r
        transition-all duration-300

        ${collapsed ? "w-20" : "w-60"}

        transform
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="h-full flex flex-col">
        {/* LOGO */}
        <SidebarHeader className="p-3 border-b border-sidebar-border">
          <NavLink to="/" className="flex items-center gap-2.5 px-1 py-0.5">
            {collapsed ? (
              <img src={isDark ? images.icon : images.icon} alt="logo" width={35} />
            ) : (
              <img
                src={isDark ? images.icon : images.icon}
                alt="logo"
                width={133}
              />
            )}
          </NavLink>
        </SidebarHeader>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {sections.map((section) => {
            const isActiveSection = sectionHasActive(section.items);

            return (
              <div
                key={section.label}
                className={`
                  space-y-1 rounded-md transition-all
                  ${isActiveSection ? "bg-sidebar-accent/5 border border-sidebar-accent/20" : ""}
                `}
              >
                {/* SECTION LABEL */}
                {!collapsed && (
                  <p
                    className={`
                      px-3 text-xs uppercase tracking-wider transition-colors
                      ${isActiveSection
                        ? "text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground/60"}
                    `}
                  >
                    {section.label}
                  </p>
                )}

                {/* ITEMS */}
                <div className="space-y-1">
                  {section.items.map((item, index: number) => {
                    const active = isActive(item.url);
                    const Icon = item.icon;

                    return (
                        <NavLink
                          key={index}
                          to={item.url}
                          title={collapsed ? item.title : undefined}
                          className={`relative flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out group ${active
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                            } ${collapsed ? "justify-center" : ""}`}
                        >
                          {/* 🔹 Active indicator bar */}
                          {active && (
                            <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-primary" />
                          )}

                          <Icon
                            className={`
      h-5 w-5 shrink-0 transition-colors
      ${active ? "text-primary" : "group-hover:text-primary"}
    `}
                          />

                          {!collapsed && (
                            <span className="text-sm truncate">{item.title}</span>
                          )}
                        </NavLink>
                      );
                  })}
                </div>

                {/* divider */}
                {!collapsed && (
                  <div className="h-px bg-sidebar-border/40 mt-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2 w-full rounded-md
              text-red-400 hover:bg-red-500/10 transition
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}