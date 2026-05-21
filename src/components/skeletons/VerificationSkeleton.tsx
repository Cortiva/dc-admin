import { Skeleton } from "../ui/skeleton";

export function VerificationSkeleton() {
    return (
        <div className="bg-card p-4 rounded-xl border space-y-4">
            <Skeleton className="h-4 w-40" />

            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2 w-20" />
                    </div>
                </div>
            ))}

            <Skeleton className="h-9 w-full rounded-md" />
        </div>
    );
}