import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  BarChart3,
  LogOut,
  UserPlus,
} from "lucide-react";

import { NavLink } from "../NavLink";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    ],
  },

  {
    label: "User Management",
    items: [
      { title: "All Members", url: "/members", icon: Users },
      { title: "Visitors", url: "/visitors", icon: UserPlus },
    ],
  },

  {
    label: "Analytics",
    items: [
      { title: "Reports & Insights", url: "/analytics", icon: BarChart3 },
    ],
  },

  {
    label: "System",
    items: [
      { title: "Audit Logs", url: "/system/audit", icon: ShieldAlert },
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
              <Link to="/" className="flex items-center gap-3">
                  <img src={isDark ? images.icon : images.icon} alt="Dominion City" width={35} />
                  <div className="flex flex-col">
                      <h1 className="text-[17px] font-bold">Dominion City</h1>
                      <p className="text-[14px] text-muted-foreground">Surulere</p>
                  </div>
              </Link>
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