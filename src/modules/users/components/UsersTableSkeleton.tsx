import { Skeleton } from "../../../components/ui/skeleton";

export default function UsersTableSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden bg-card">
            <div className="p-4 border-b bg-muted/50">
                <div className="grid grid-cols-12 gap-4">
                    <Skeleton className="h-4 col-span-1" />
                    <Skeleton className="h-4 col-span-3" />
                    <Skeleton className="h-4 col-span-3" />
                    <Skeleton className="h-4 col-span-2" />
                    <Skeleton className="h-4 col-span-2" />
                    <Skeleton className="h-4 col-span-1" />
                </div>
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 border-b last:border-b-0">
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <Skeleton className="h-4 col-span-1" />
                        <div className="col-span-3 flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-4 col-span-3" />
                        <Skeleton className="h-6 col-span-2 rounded-full" />
                        <Skeleton className="h-6 col-span-2 rounded-full" />
                        <Skeleton className="h-8 w-8 col-span-1 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}