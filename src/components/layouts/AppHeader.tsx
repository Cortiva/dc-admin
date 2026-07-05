import {
    LogOut,
    Moon,
    PanelLeftClose,
    Sun,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useTheme } from "../../provider/theme-context";
import { useNavigate } from "react-router-dom";
import { logout, selectCurrentUser } from "../../modules/auth/authSlice";
import Breadcrumb from "../ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AppHeader({
  collapsed,
  setCollapsed,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            setMobileOpen(true);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const initials = user?.firstName
        ? user.firstName.charAt(0).toUpperCase() +
        (user.lastName?.charAt(0).toUpperCase() || "")
        : "AD";

    const fullname = user
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "Admin";

    return (
        <>
            {/* HEADER */}
            <header
                className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 bg-card backdrop-blur-2xl border-b border-white/10 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
                {/* subtle glass light overlay */}
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-white/5 via-transparent to-white/5 dark:from-white/5 dark:to-transparent pointer-events-none" />

                {/* LEFT */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleToggle}
                        className="bg-background p-2 rounded-lg hover:bg-background border border-background transition-all cursor-pointer"
                    >
                        <PanelLeftClose className="text-primary h-5 w-5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 text-sm">
                        <Breadcrumb />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* SEARCH */}
                    {/* <div className="relative hidden md:block w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search users, jobs, disputes..."
                            className="h-9 pl-9 text-sm bg-background border border-background backdrop-blur-xl focus:bg-background transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="md:hidden p-2 rounded-lg bg-background hover:bg-background border border-background transition-all"
                    >
                        <Search className="h-4 w-4" />
                    </button> */}

                    {/* THEME */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-background hover:bg-background border border-background transition-all"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* NOTIFICATIONS */}
                    {/* <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="relative p-2 rounded-lg bg-background hover:bg-background border border-background transition-all"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadNotifs.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                                        {unreadNotifs.length}
                                    </span>
                                )}
                            </button>
                        </PopoverTrigger>

                        <PopoverContent
                            align="end"
                            className="w-80 p-0 bg-background border border-card shadow-xl"
                        >
                            <div className="border-b border-muted-card px-4 py-3 flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Notifications</h4>
                                <Badge className="text-[10px]">{unreadNotifs.length} new</Badge>
                            </div>

                            <div className="max-h-72 overflow-y-auto">
                                {mockNotifications.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => navigate("/admin/notifications")}
                                        className={`flex w-full gap-3 px-4 py-3 text-left hover:bg-background transition-colors border-b border-muted-card last:border-0 ${!n.read ? "bg-background" : ""}`}
                                    >
                                        <div
                                            className={`mt-1 h-2 w-2 rounded-full ${!n.read ? "bg-primary" : "bg-transparent"
                                                }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs ${!n.read ? "font-semibold" : ""}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground truncate">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60">
                                                {n.date}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-muted-card p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={() => navigate("/admin/notifications")}
                                >
                                    View All
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover> */}

                    {/* USER */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background hover:bg-background/10 border border-background transition-all"
                            >
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={user?.profileImageUrl || ""} />
                                    <AvatarFallback className="text-[10px] bg-gradient-primary text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-medium leading-none">
                                        {fullname}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {user?.role}
                                    </p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>
                                <p className="text-sm font-medium">{fullname}</p>
                                <p className="text-xs text-muted-foreground">{user?.role}</p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => navigate("/settings")}>
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-500"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* MOBILE SEARCH */}
            {/* {searchOpen && (
                <div className="border-b border-white/10 bg-black/10 backdrop-blur-xl px-4 py-2 md:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            autoFocus
                            className="h-9 pl-9 text-sm bg-background border-background/10"
                        />
                    </div>
                </div>
            )} */}
        </>
    );
};