import { Skeleton } from "../ui/skeleton";

export function AlertsSkeleton() {
    return (
        <div className="bg-card p-4 rounded-xl border space-y-3">
            <Skeleton className="h-4 w-40" />

            {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
        </div>
    );
}