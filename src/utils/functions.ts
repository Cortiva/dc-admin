import {
    formatDistanceToNow,
    format,
    isYesterday,
    isToday,
    isThisWeek,
    differenceInMinutes,
    differenceInHours,
    isThisYear,
} from "date-fns";
import { toast } from "sonner";

type ApiError = {
    data?: {
        message?: string;
        data?: {
            issues?: {
                path: string;
                message: string;
            }[];
        };
    };
};

export function handleApiError(error: unknown): void {
    if (error && typeof error === "object" && "data" in error) {
        const err = error as ApiError;

        const issues = err.data?.data?.issues;

        if (issues && Array.isArray(issues) && issues.length > 0) {
            issues.forEach((issue) => {
                toast.error(issue.message);
            });
        } else if (err.data?.message) {
            toast.error(err.data.message);
        } else {
            toast.error("An unknown error occurred.");
        }
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong.");
    }
}

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Format number with commas and optional decimal precision
export const formatNumber = (
    number: number | string,
    decimals: number = 0,
): string => {
    const num = Number(number);
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Alias with different name (you can remove one if not needed)
export const formatNumberN = formatNumber;

// Compute percentage of a value relative to total
export const computePercentage = (number: number, total: number): number => {
    if (total === 0 || number === 0) return 0;
    return Math.round((number / total) * 100);
};

// Format date to 'YYYY-MM-DD' (e.g., 2024-06-07)
export const formatDateSubmission = (date?: Date | string): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Check if an object with the given ID exists in array
export const doesIdExist = <T extends { id: string | number }>(
    arr: T[],
    id: string | number,
): boolean => {
    return arr.some((profile) => profile.id === id);
};

export const formatTimestamp = (
    timestamp: Date | { toDate: () => Date },
): string => {
    // Normalize to JavaScript Date
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate?.();

    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return "Invalid date";
    }

    // Smart formatting logic
    if (isToday(date)) return formatDistanceToNow(date, { addSuffix: false });
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return format(date, "EEEE"); // e.g., Monday

    return format(date, "MMM d, yyyy"); // e.g., Oct 30, 2024
};

// Check if any value in object or array is empty
export const hasEmptyValue = (
    data: Record<string, unknown> | unknown[],
): boolean | undefined => {
    if (Array.isArray(data)) {
        return data.some(
            (value) => value === null || value === undefined || value === "",
        );
    } else if (typeof data === "object" && data !== null) {
        return Object.values(data).some(
            (value) => value === null || value === undefined || value === "",
        );
    } else {
        console.warn("Input should be an array or an object");
        return undefined;
    }
};

// Calculate age from DOB in 'DD-MM-YYYY' format
export const calculateAge = (dob: string): number => {
    const [day, month, year] = dob.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    const birthDate = new Date(formattedDate);

    if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date format. Expected format: DD-MM-YYYY");
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Formats a timestamp into a human-friendly chat time format.
 * - < 24hrs: shows "x mins/hours ago"
 * - Yesterday: "Yesterday"
 * - This week: weekday name (e.g., "Monday")
 * - This year: "MMM d" (e.g., "Mar 15")
 * - Older: "MMM d, yyyy" (e.g., "Apr 2, 2023")
 */
export const formatChatTimestamp = (
    timestamp: Date | { toDate: () => Date } | string,
): string => {
    let date: Date | undefined;

    if (timestamp instanceof Date) {
        date = timestamp;
    } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
    } else if (
        typeof timestamp === "object" &&
        typeof timestamp.toDate === "function"
    ) {
        date = timestamp.toDate();
    }

    if (!date || isNaN(date.getTime())) {
        return "Invalid date";
    }

    const now = new Date();
    const minutesAgo = differenceInMinutes(now, date);
    const hoursAgo = differenceInHours(now, date);

    if (isToday(date)) {
        if (minutesAgo < 60) {
            return `${minutesAgo} min${minutesAgo === 1 ? "" : "s"} ago`;
        }
        return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    }

    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, "EEEE");
    if (isThisYear(date)) return format(date, "MMM d");

    return format(date, "MMM d, yyyy");
};

export const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const appLaunchYear = 2023;
    const years = [];

    for (let year = currentYear; year >= appLaunchYear; year--) {
        years.push({
            value: year.toString(),
            label: year.toString(),
        });
    }

    return years;
};

export const createExcerpt = (
    html: string,
    maxLength: number = 180,
): string => {
    // Strip HTML tags
    const plainText = html.replace(/<[^>]*>?/gm, "");
    // Trim to maxLength and add ellipsis if truncated
    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + "..."
        : plainText;
};

export const getDaysOpen = (date: string | Date) => {
    const created = new Date(date);
    const now = new Date();

    const diffTime = now.getTime() - created.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // ms → days
};

export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};

export const getInitials = (first: string, last: string) =>
    `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
