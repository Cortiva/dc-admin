import { Skeleton } from "../../../components/ui/skeleton";

export function AlertsSkeleton() {
    return (
        <div className="mb-6 bg-muted/30 border-l-4 border-muted p-4 rounded-r-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
}