import { ChevronDown, ChevronRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import CustomBadge from "./CustomBadge";
import type { ServiceCategory } from "../modules/category/types/service-category.types";

interface CategoryTreeItemProps {
    category: ServiceCategory;
    onClick?: () => void;
    onEdit?: (c: ServiceCategory) => void;
    onDelete?: (c: ServiceCategory) => void;
    subcategories?: Array<{ name: string; count: number; skills: number }>;
};

export default function CategoryTreeItem({
    category,
    onClick,
    onEdit,
    onDelete,
    subcategories,
}: CategoryTreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div>
            {/* ================= MAIN ITEM ================= */}
            <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
                ${category.isActive ? "bg-primary-50 text-primary-700" : "hover:bg-background"}`}
                onClick={onClick}
            >
                <div className="flex items-center gap-2">
                    {subcategories && subcategories.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="p-0.5 hover:bg-background rounded cursor-pointer"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    <div className="w-4 h-4 bg-background rounded-2xl shadow-lg flex items-center justify-center text-sm">
                        {category.icon}
                    </div>

                    <span className="text-sm font-medium">{category.name}</span>
                    <CustomBadge size="xs" variant="secondary">
                        {category.children?.length || 0}
                    </CustomBadge>
                </div>

                {/* ================= DROPDOWN ================= */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen((prev) => !prev);
                        }}
                        className="p-1 hover:bg-background rounded cursor-pointer"
                    >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-card border border-muted-card rounded-lg shadow-lg z-20 cursor-pointer">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onEdit?.(category);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-background cursor-pointer"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onDelete?.(category);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-background cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= SUB ITEMS ================= */}
            {isExpanded && subcategories && (
                <div className="ml-8 mt-1 space-y-1">
                    {subcategories.map((sub) => (
                        <SubItem key={sub.name} sub={sub} />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ================= SUB ITEM COMPONENT ================= */

function SubItem({ sub }: { sub: { name: string; count: number; skills: number } }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div
            className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-background cursor-pointer"
        >
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{sub.name}</span>

                <CustomBadge size="xs" variant="info">
                    {sub.count}
                </CustomBadge>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground">
                                {sub.skills} skills
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            {sub.skills} associated skills
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="relative" ref={ref}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((prev) => !prev);
                    }}
                    className="p-1 hover:bg-background rounded cursor-pointer"
                >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-card border border-muted-card rounded-lg shadow-lg z-20">
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-background cursor-pointer">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>

                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-background cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}