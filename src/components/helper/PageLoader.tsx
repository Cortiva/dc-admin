import images from "../../utils/images";
import { useTheme } from "../../provider/theme-context";

export default function PageLoader() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
            {/* Logo mark */}
            <div className="relative">
                {/* Outer spinner ring */}
                <div className="absolute inset-0 -m-3 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />

                <div className="w-14 h-14 bg-transparent flex items-center justify-center animate-pulse">
                    <img src={isDark ? images.icon : images.icon} alt="logo" width={35} />
                </div>
            </div>
        </div>
    );
}
