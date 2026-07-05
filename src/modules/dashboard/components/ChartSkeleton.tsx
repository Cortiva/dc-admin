import { Skeleton } from "../../../components/ui/skeleton";
import { Card } from "../../../components/ui/card";

export function ChartSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-6">
                <Skeleton className="h-6 w-40 mb-6" />
                <Skeleton className="h-62.5 w-full rounded-lg" />
            </Card>
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-6">
                <Skeleton className="h-6 w-40 mb-6" />
                <Skeleton className="h-62.5 w-full rounded-lg" />
            </Card>
        </div>
    );
}