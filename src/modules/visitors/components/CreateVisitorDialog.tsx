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
import { Checkbox } from "../../../components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import type { CreateVisitorRequest } from "../types/visitor.types";
import { useCreateVisitorMutation } from "../visitorApiSlice";
import { EDUCATION_VALUES, ENUM_LABELS, GENDER_VALUES, HOW_HEARD_VALUES, SERVICE_TYPE_VALUES } from "../visitorValidation";

interface CreateVisitorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EMPTY_FORM: CreateVisitorRequest = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "MALE",
    homeAddress: "",
    howHeardAboutUs: "SOCIAL_MEDIA",
    age: 0,
    levelOfEducation: "TERTIARY",
    localGovernmentArea: "",
    birthday: "",
    preferenceToReturn: true,
    whatTheyLovedMost: "",
    isBeliever: true,
    serviceType: "SUNDAY_SERVICE",
    visitDate: new Date().toISOString().slice(0, 10),
    notes: "",
};

export default function CreateVisitorDialog({ isOpen, onClose, onSuccess }: CreateVisitorDialogProps) {
    const [form, setForm] = useState<CreateVisitorRequest>(EMPTY_FORM);
    const [createVisitor, { isLoading }] = useCreateVisitorMutation();

    const update = <K extends keyof CreateVisitorRequest>(key: K, value: CreateVisitorRequest[K]) =>
        setForm((p) => ({ ...p, [key]: value }));

    const handleClose = () => {
        setForm(EMPTY_FORM);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createVisitor(form).unwrap();
            toast.success(`${form.firstName} ${form.lastName} has been added`);
            setForm(EMPTY_FORM);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a visitor</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold border-b pb-2">Personal details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name *</Label>
                                <Input
                                    id="firstName"
                                    required
                                    value={form.firstName}
                                    onChange={(e) => update("firstName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name *</Label>
                                <Input
                                    id="lastName"
                                    required
                                    value={form.lastName}
                                    onChange={(e) => update("lastName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    required
                                    value={form.phone}
                                    onChange={(e) => update("phone", e.target.value)}
                                    placeholder="+234 803 555 1212"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender *</Label>
                                <Select value={form.gender} onValueChange={(v) => update("gender", v as CreateVisitorRequest["gender"])}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GENDER_VALUES.map((g) => (
                                            <SelectItem key={g} value={g}>
                                                {ENUM_LABELS[g]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    min={0}
                                    max={120}
                                    required
                                    value={form.age || ""}
                                    onChange={(e) => update("age", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthday">Birthday *</Label>
                                <Input
                                    id="birthday"
                                    type="date"
                                    required
                                    value={form.birthday}
                                    onChange={(e) => update("birthday", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Level of education *</Label>
                                <Select
                                    value={form.levelOfEducation}
                                    onValueChange={(v) => update("levelOfEducation", v as CreateVisitorRequest["levelOfEducation"])}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EDUCATION_VALUES.map((e) => (
                                            <SelectItem key={e} value={e}>
                                                {ENUM_LABELS[e]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                <Label htmlFor="homeAddress">Home address *</Label>
                                <Input
                                    id="homeAddress"
                                    required
                                    value={form.homeAddress}
                                    onChange={(e) => update("homeAddress", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lga">Local government area *</Label>
                                <Input
                                    id="lga"
                                    required
                                    value={form.localGovernmentArea}
                                    onChange={(e) => update("localGovernmentArea", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold border-b pb-2">Visit details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Service type *</Label>
                                <Select
                                    value={form.serviceType}
                                    onValueChange={(v) => update("serviceType", v as CreateVisitorRequest["serviceType"])}
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
                                    onChange={(e) => update("visitDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>How did they hear about us? *</Label>
                                <Select
                                    value={form.howHeardAboutUs}
                                    onValueChange={(v) => update("howHeardAboutUs", v as CreateVisitorRequest["howHeardAboutUs"])}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOW_HEARD_VALUES.map((h) => (
                                            <SelectItem key={h} value={h}>
                                                {ENUM_LABELS[h]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                <Label htmlFor="whatTheyLovedMost">What they loved most *</Label>
                                <Input
                                    id="whatTheyLovedMost"
                                    required
                                    value={form.whatTheyLovedMost}
                                    onChange={(e) => update("whatTheyLovedMost", e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={form.notes}
                                    onChange={(e) => update("notes", e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="preferenceToReturn"
                                    checked={form.preferenceToReturn}
                                    onCheckedChange={(c) => update("preferenceToReturn", c as boolean)}
                                />
                                <Label htmlFor="preferenceToReturn" className="cursor-pointer">
                                    Would like to return
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isBeliever"
                                    checked={form.isBeliever}
                                    onCheckedChange={(c) => update("isBeliever", c as boolean)}
                                />
                                <Label htmlFor="isBeliever" className="cursor-pointer">
                                    Identifies as a believer
                                </Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add visitor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}