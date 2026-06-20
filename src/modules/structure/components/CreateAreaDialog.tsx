import { useState } from "react";
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
import { useCreateAreaMutation } from "../structureApiSlice";

interface CreateAreaDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EMPTY = { name: "", description: "", leaderId: "" };

export function CreateAreaDialog({ isOpen, onClose, onSuccess }: CreateAreaDialogProps) {
    const [form, setForm] = useState(EMPTY);
    const [createArea, { isLoading }] = useCreateAreaMutation();

    const handleClose = () => {
        setForm(EMPTY);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.leaderId) {
            toast.error("Choose a leader for this area");
            return;
        }
        try {
            await createArea(form).unwrap();
            toast.success(`${form.name} has been created`);
            setForm(EMPTY);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create an area</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Area name *</Label>
                        <Input
                            id="name"
                            required
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Surulere Central"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            required
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="What this area covers"
                            rows={3}
                        />
                    </div>

                    <LeaderPickerInlineField
                        label="Area leader *"
                        leaderId={form.leaderId}
                        onChange={(leaderId) => setForm((p) => ({ ...p, leaderId }))}
                    />

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create area"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}