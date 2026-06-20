import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import { LeaderPickerInlineField } from "./LeaderPickerInlineField";
import { useCreateCellMutation } from "../structureApiSlice";

interface CreateCellDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    zoneId: string;
    zoneName: string;
}

const emptyForm = (zoneId: string) => ({ name: "", description: "", zoneId, leaderId: "" });

export function CreateCellDialog({
    isOpen,
    onClose,
    onSuccess,
    zoneId,
    zoneName,
}: CreateCellDialogProps) {
    const [form, setForm] = useState(emptyForm(zoneId));
    const [createCell, { isLoading }] = useCreateCellMutation();

    useEffect(() => {
        setForm((p) => ({ ...p, zoneId }));
    }, [zoneId]);

    const handleClose = () => {
        setForm(emptyForm(zoneId));
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.leaderId) {
            toast.error("Choose a leader for this cell");
            return;
        }
        try {
            await createCell(form).unwrap();
            toast.success(`${form.name} has been created`);
            setForm(emptyForm(zoneId));
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a cell</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground -mt-2">
                    This cell will belong to <span className="font-medium">{zoneName}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Cell name *</Label>
                        <Input
                            id="name"
                            required
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Grace Cell"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            required
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Meeting day, focus, or anything notable"
                            rows={3}
                        />
                    </div>

                    <LeaderPickerInlineField
                        label="Cell leader *"
                        leaderId={form.leaderId}
                        onChange={(leaderId) => setForm((p) => ({ ...p, leaderId }))}
                    />

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create cell"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}