import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Phone, Mail, MapPin, Calendar, GraduationCap, Heart } from "lucide-react";
import type { Visitor } from "../types/visitor.types";
import { VisitorStatusBadge } from "./VisitorStatusBadge";
import { InfoRows } from "../../users/components/InfoRow";
import { ENUM_LABELS } from "../visitorValidation";

interface ViewVisitorDialogProps {
    visitor: Visitor | null;
    onClose: () => void;
    onAssignCell: (visitor: Visitor) => void;
    onRecordVisit: (visitor: Visitor) => void;
}

export function ViewVisitorDialog({
    visitor,
    onClose,
    onAssignCell,
    onRecordVisit,
}: ViewVisitorDialogProps) {
    if (!visitor) return null;

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <Dialog open={!!visitor} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Visitor profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-6 bg-linear-to-r from-primary/10 to-transparent rounded-xl">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl">
                                {getInitials(visitor.firstName, visitor.lastName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold truncate">
                                {visitor.firstName} {visitor.lastName}
                            </h2>
                            <p className="text-sm text-muted-foreground truncate">{visitor.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <VisitorStatusBadge status={visitor.status} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRows icon={<Phone className="w-5 h-5" />} label="Phone" value={visitor.phone} />
                        <InfoRows icon={<Mail className="w-5 h-5" />} label="Email" value={visitor.email} />
                        <InfoRows
                            icon={<MapPin className="w-5 h-5" />}
                            label="Home address"
                            value={`${visitor.homeAddress}, ${visitor.localGovernmentArea}`}
                        />
                        <InfoRows
                            icon={<Calendar className="w-5 h-5" />}
                            label="Birthday"
                            value={new Date(visitor.birthday).toLocaleDateString()}
                        />
                        <InfoRows
                            icon={<GraduationCap className="w-5 h-5" />}
                            label="Level of education"
                            value={ENUM_LABELS[visitor.levelOfEducation] ?? visitor.levelOfEducation}
                        />
                        <InfoRows
                            icon={<Heart className="w-5 h-5" />}
                            label="What they loved most"
                            value={visitor.whatTheyLovedMost}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Cell</p>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <span className="text-sm">
                                {visitor.cellName ?? "Not assigned to a cell yet"}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => onAssignCell(visitor)}>
                                {visitor.cellName ? "Change" : "Assign"}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-wrap gap-2">
                    <Button variant="outline" onClick={() => onRecordVisit(visitor)}>
                        Record a new visit
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}