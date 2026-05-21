"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { useState } from "react";

interface DateRangePickerProps {
    value?: { from: Date; to: Date };
    onChange?: (range: { from: Date; to: Date }) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export function DateRangePicker({
    value,
    onChange,
    className,
    placeholder = "Select date range",
    disabled = false,
}: DateRangePickerProps) {
    // const [date, setDate] = useState<DateRange | undefined>({
    //     from: value?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    //     to: value?.to || new Date(),
    // });

    const [date, setDate] = useState<{ from: Date; to: Date }>(() => {
        const now = new Date();
        const past = value?.from || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            from: past,
            to: value?.to || now,
        };
    });

    const handleDateChange = (newDate: { from?: Date; to?: Date } | undefined) => {
        if (!newDate?.from || !newDate?.to) return;

        const normalized = {
            from: newDate.from,
            to: newDate.to,
        };

        setDate(normalized);
        onChange?.(normalized);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}