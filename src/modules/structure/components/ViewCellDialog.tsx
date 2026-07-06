import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Calendar, Layers, MapPin } from "lucide-react";
import { useState } from "react";
import { LeaderCard } from "./LeaderCard";
import { LeaderPickerDialog } from "./LeaderPickerDialog";
import { EditDetailsDialog } from "./EditDetailDialog";
import type { CellResponse } from "../../../types/structure.types";
import { useUpdateCellMutation, useAssignCellLeaderMutation } from "../structureApiSlice";

interface ViewCellDialogProps {
    cell: CellResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function ViewCellDialog({ cell, onClose, onSuccess }: ViewCellDialogProps) {
    const [isLeaderPickerOpen, setIsLeaderPickerOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [updateCell] = useUpdateCellMutation();
    const [assignCellLeader] = useAssignCellLeaderMutation();

    if (!cell) return null;

    const handleAssignLeader = async (leaderId: string) => {
        await assignCellLeader({
            id: cell.id,
            data: { leaderId }
        }).unwrap();
        onSuccess();
    };

    return (
        <>
            <Dialog open={!!cell} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{cell.name}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{cell.description || "No description"}</p>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Layers className="w-4 h-4" />
                                <span>Zone: {cell.zone?.name || "Not assigned"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Area: {cell.zone?.area?.name || "Not assigned"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Created {new Date(cell.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <LeaderCard 
                            leader={cell.leader || null} 
                            onChangeLeader={() => setIsLeaderPickerOpen(true)} 
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                            Edit details
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <LeaderPickerDialog
                isOpen={isLeaderPickerOpen}
                onClose={() => setIsLeaderPickerOpen(false)}
                currentLeaderId={cell.leader?.id}
                targetLabel={cell.name}
                onAssign={handleAssignLeader}
            />

            <EditDetailsDialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={() => {
                    setIsEditOpen(false);
                    onSuccess();
                }}
                title="Edit cell"
                initialName={cell.name}
                initialDescription={cell.description ?? ""}
                onSave={(data) => updateCell({ id: cell.id, data }).unwrap().then(() => onSuccess())}
            />
        </>
    );
}