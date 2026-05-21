import { Skeleton } from "../ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-card p-4 rounded-xl border space-y-4">
            <Skeleton className="h-4 w-40" />

            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}