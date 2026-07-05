import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { cn } from "../../../lib/utils";

type PeriodType = "day" | "week" | "month" | "quarter" | "year";

interface FilterBarProps {
    period: PeriodType;
    dateFrom?: string;
    dateTo?: string;
    onFilterChange: (filters: { period?: PeriodType; dateFrom?: string; dateTo?: string }) => void;
    isRefreshing?: boolean;
}

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
];

export function FilterBar({ period, dateFrom, dateTo, onFilterChange, isRefreshing }: FilterBarProps) {
    const currentPeriodLabel = PERIOD_OPTIONS.find(p => p.value === period)?.label || "Month";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-card rounded-xl border border-muted-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Showing:</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-auto p-0 text-foreground font-medium hover:bg-transparent hover:text-primary"
                            disabled={isRefreshing}
                        >
                            {currentPeriodLabel}
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        {PERIOD_OPTIONS.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => onFilterChange({ period: option.value })}
                                className={cn(
                                    "cursor-pointer",
                                    period === option.value && "bg-primary/10 text-primary font-medium"
                                )}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {dateFrom && dateTo ? (
                    <span>
                        {new Date(dateFrom).toLocaleDateString()} - {new Date(dateTo).toLocaleDateString()}
                    </span>
                ) : (
                    <span>Last 30 days</span>
                )}
            </div>
        </div>
    );
}