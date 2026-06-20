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
import { toast } from "react-toastify"
import { handleApiError } from "../../../utils/functions";
import { LeaderPickerInlineField } from "./LeaderPickerInlineField";
import { useCreateZoneMutation } from "../structureApiSlice";

interface CreateZoneDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    areaId: string;
    areaName: string;
}

const emptyForm = (areaId: string) => ({ name: "", description: "", areaId, leaderId: "" });

export function CreateZoneDialog({
    isOpen,
    onClose,
    onSuccess,
    areaId,
    areaName,
}: CreateZoneDialogProps) {
    const [form, setForm] = useState(emptyForm(areaId));
    const [createZone, { isLoading }] = useCreateZoneMutation();

    // Keep the hidden areaId in sync if this dialog is reused across
    // different parent areas without being unmounted.
    useEffect(() => {
        setForm((p) => ({ ...p, areaId }));
    }, [areaId]);

    const handleClose = () => {
        setForm(emptyForm(areaId));
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.leaderId) {
            toast.error("Choose a leader for this zone");
            return;
        }
        try {
            await createZone(form).unwrap();
            toast.success(`${form.name} has been created`);
            setForm(emptyForm(areaId));
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a zone</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground -mt-2">
                    This zone will belong to <span className="font-medium">{areaName}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Zone name *</Label>
                        <Input
                            id="name"
                            required
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Ijesha Zone"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            required
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="What this zone covers"
                            rows={3}
                        />
                    </div>

                    <LeaderPickerInlineField
                        label="Zone leader *"
                        leaderId={form.leaderId}
                        onChange={(leaderId) => setForm((p) => ({ ...p, leaderId }))}
                    />

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create zone"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}