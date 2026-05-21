import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const limitOptions = [1, 10, 20, 50, 100];

interface AppPaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export default function AppPagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onLimitChange,
}: AppPaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    const generatePages = () => {
        const pages: number[] = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = generatePages();

    return (
        <div className="px-6 py-4 border-t border-background flex items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Page size:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="px-2 py-1 text-sm bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {limitOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="text-sm text-muted-foreground">
                    Showing {start} to {end} of {totalItems}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {pages.map((page) => (
                    <Button
                        key={page}
                        onClick={() => onPageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                    >
                        {page}
                    </Button>
                ))}

                <Button variant="outline" size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}