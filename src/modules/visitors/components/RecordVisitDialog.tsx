import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { toast } from "react-toastify";
import type { RecordVisitRequest, ServiceType, Visitor } from "../types/visitor.types";
import { useRecordVisitorVisitMutation } from "../visitorApiSlice";
import { handleApiError } from "../../../utils/functions";
import { ENUM_LABELS, SERVICE_TYPE_VALUES } from "../visitorValidation";

interface RecordVisitDialogProps {
    visitor: Visitor | null;
    onClose: () => void;
    onSuccess: () => void;
}

const emptyForm = (): RecordVisitRequest => ({
    serviceType: "SUNDAY_SERVICE",
    visitDate: new Date().toISOString().slice(0, 10),
    notes: "",
});

export function RecordVisitDialog({ visitor, onClose, onSuccess }: RecordVisitDialogProps) {
    const [form, setForm] = useState<RecordVisitRequest>(emptyForm());
    const [recordVisit, { isLoading }] = useRecordVisitorVisitMutation();

    const handleClose = () => {
        setForm(emptyForm());
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!visitor) return;
        try {
            await recordVisit({ id: visitor.id, data: form }).unwrap();
            toast.success(`Visit recorded for ${visitor.firstName}`);
            setForm(emptyForm());
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={!!visitor} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record a visit for {visitor?.firstName}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Service type *</Label>
                        <Select
                            value={form.serviceType}
                            onValueChange={(v) => setForm((p) => ({ ...p, serviceType: v as ServiceType }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SERVICE_TYPE_VALUES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {ENUM_LABELS[s]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="visitDate">Visit date *</Label>
                        <Input
                            id="visitDate"
                            type="date"
                            required
                            value={form.visitDate}
                            onChange={(e) => setForm((p) => ({ ...p, visitDate: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={form.notes}
                            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Record visit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}