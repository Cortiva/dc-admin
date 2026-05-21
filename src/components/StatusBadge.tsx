interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<string, string> = {
        in_progress: "bg-blue-100 text-blue-700",
        pending: "bg-yellow-100 text-yellow-700",
        accepted: "bg-purple-100 text-purple-700",
        completed: "bg-green-100 text-green-700",
        en_route: "bg-indigo-100 text-indigo-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const labels: Record<string, string> = {
        in_progress: "In Progress",
        pending: "Pending",
        accepted: "Accepted",
        completed: "Completed",
        en_route: "En Route",
        cancelled: "Cancelled",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-muted-card text-muted-foreground"}`}>
            {labels[status] || status}
        </span>
    );
}
