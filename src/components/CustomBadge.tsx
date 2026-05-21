interface CustomBadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "premium";
    size?: "xs" | "sm" | "md";
    className?: string;
    icon?: React.ReactNode;
}


export default function StatusBadge({ children, variant = "primary", size = "md", className = "", icon }: CustomBadgeProps) {
    const variantStyles = {
        primary: "bg-teal-500/10 text-teal",
        secondary: "bg-background text-foreground",
        success: "bg-green-500/10 text-green-700 border-green-700",
        danger: "bg-red-500/10 text-red-700",
        warning: "bg-yellow-500/10 text-yellow-700",
        info: "bg-blue-500/10 text-blue-700",
        premium: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white"
    };
    
    const sizeStyles = {
        xs: "px-1.5 py-0.5 text-[10px]",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm"
    };

    return (
        <span className={`
            inline-flex items-center gap-1 font-medium rounded-full border
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${variant === "premium" ? "border-transparent" : ""}
            ${className}
        `}>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </span>
    );
}
