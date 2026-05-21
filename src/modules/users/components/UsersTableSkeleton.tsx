import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export default function UsersTableSkeleton() {
    return (
        <Card className="p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <Skeleton className="h-10 w-full md:w-64 rounded-lg" />
                <Skeleton className="h-10 w-40 rounded-lg" />
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <Skeleton className="h-3 w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {Array.from({ length: 6 }).map((_, row) => (
                            <tr key={row}>
                                {Array.from({ length: 6 }).map((_, col) => (
                                    <td key={col} className="px-4 py-4">
                                        <Skeleton className="h-4 w-full max-w-30" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-md" />
                    ))}
                </div>
            </div>
        </Card>
    );
}