import { Badge } from "../../../components/ui/badge";
import type { VisitorStatus } from "../types/visitor.types";

const STATUS_STYLES: Record<VisitorStatus, string> = {
    FIRST_TIMER: "bg-blue-100 text-blue-800",
    SECOND_TIMER: "bg-purple-100 text-purple-800",
    RETURNING: "bg-green-100 text-green-800",
};

const STATUS_LABELS: Record<VisitorStatus, string> = {
    FIRST_TIMER: "First Timer",
    SECOND_TIMER: "Second Timer",
    RETURNING: "Returning",
};

export function VisitorStatusBadge({ status }: { status: VisitorStatus }) {
    return <Badge className={STATUS_STYLES[status]}>{STATUS_LABELS[status]}</Badge>;
}