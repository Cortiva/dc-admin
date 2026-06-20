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

interface EditDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    title: string; // e.g. "Edit area"
    initialName: string;
    initialDescription: string;
    onSave: (data: { name: string; description: string }) => Promise<unknown>;
}

// Shared across Area/Zone/Cell since UpdateAreaRequest, UpdateZoneRequest,
// and UpdateCellRequest are all { name, description } — no need for three
// near-identical dialogs.
export function EditDetailsDialog({
    isOpen,
    onClose,
    onSuccess,
    title,
    initialName,
    initialDescription,
    onSave,
}: EditDetailsDialogProps) {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [isSaving, setIsSaving] = useState(false);

    // Re-sync local state whenever a different record is opened for editing.
    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setDescription(initialDescription);
        }
    }, [isOpen, initialName, initialDescription]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({ name, description });
            toast.success("Changes saved");
            onSuccess();
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name *</Label>
                        <Input
                            id="edit-name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description *</Label>
                        <Textarea
                            id="edit-description"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}