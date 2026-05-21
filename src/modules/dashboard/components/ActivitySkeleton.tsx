import { Skeleton } from "../../../components/ui/skeleton";

export function ActivitySkeleton() {
    return (
        <div className="bg-card p-4 rounded-xl border space-y-4">
            <Skeleton className="h-4 w-40" />

            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1 flex-1">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-2 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}