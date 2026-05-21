import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export default function UsersStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card
                    key={i}
                    className="p-5 rounded-2xl border border-muted-card"
                >
                    <div className="flex items-start justify-between">
                        {/* Left */}
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-3 w-28" />
                        </div>

                        {/* Icon */}
                        <Skeleton className="w-10 h-10 rounded-xl" />
                    </div>
                </Card>
            ))}
        </div>
    );
}