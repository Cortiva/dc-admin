import { Skeleton } from "../../../components/ui/skeleton";

export function ChartSkeleton() {
    return (
        <div className="bg-card p-4 rounded-xl border space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-62.5 w-full rounded-lg" />
        </div>
    );
}