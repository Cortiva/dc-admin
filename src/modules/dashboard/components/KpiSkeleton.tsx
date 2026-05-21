import { Skeleton } from "../../../components/ui/skeleton";

export function KpiSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card p-4 rounded-xl border space-y-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>
            ))}
        </div>
    );
}