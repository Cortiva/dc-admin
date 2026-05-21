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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";

// Define zones and departments (should match your mock data)
const surulereZones = [
    "Ijesha", "Bode Thomas", "Ojuelegba", "Eric Moore", "Alhaji Masha",
    "Ogunlana", "Itire", "Lawanson", "Shitta", "Adelabu", "Odi Olowu",
    "Akerele", "Wright", "Iponri"
];

const departments = [
    "Technical", "Medical", "Finance", "Legal", "Ushering", "Prayer",
    "Building", "Children", "Protocol", "Media", "Choir", "Pastoral",
    "Women", "IT", "Administration", "Kitchen", "Transport", "Catering",
    "Maintenance", "Security", "Counseling", "Youth"
];

// Define the form data type explicitly
interface MemberFormData {
    fullName: string;
    address: string;
    zone: string;
    phoneNumber: string;
    gender: string;
    maritalStatus: string;
    dateOfBirth: string;
    weddingDate: string;
    occupation: string;
    attendedDcaBasic: boolean;
    attendedDcaMaturity: boolean;
    attendedDli: boolean;
    department: string;
}

interface CreateMemberProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// type FormFieldValue = string | boolean | number | undefined;

export default function CreateMember({ isOpen, onClose, onSuccess }: CreateMemberProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<MemberFormData>({
        fullName: "",
        address: "",
        zone: "",
        phoneNumber: "",
        gender: "Male",
        maritalStatus: "Single",
        dateOfBirth: "",
        weddingDate: "",
        occupation: "",
        attendedDcaBasic: false,
        attendedDcaMaturity: false,
        attendedDli: false,
        department: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("New member:", formData);
        setIsSubmitting(false);
        onSuccess();
        onClose();
        // Reset form
        setFormData({
            fullName: "",
            address: "",
            zone: "",
            phoneNumber: "",
            gender: "Male",
            maritalStatus: "Single",
            dateOfBirth: "",
            weddingDate: "",
            occupation: "",
            attendedDcaBasic: false,
            attendedDcaMaturity: false,
            attendedDli: false,
            department: "",
        });
    };

    const handleChange = <K extends keyof MemberFormData>(
        field: K,
        value: MemberFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => handleChange("gender", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maritalStatus">Marital Status *</Label>
                                <Select
                                    value={formData.maritalStatus}
                                    onValueChange={(value) => handleChange("maritalStatus", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Married">Married</SelectItem>
                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                        <SelectItem value="Widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.maritalStatus === "Married" && (
                                <div className="space-y-2">
                                    <Label htmlFor="weddingDate">Wedding Date</Label>
                                    <Input
                                        id="weddingDate"
                                        type="date"
                                        value={formData.weddingDate}
                                        onChange={(e) => handleChange("weddingDate", e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="occupation">Occupation *</Label>
                                <Input
                                    id="occupation"
                                    required
                                    value={formData.occupation}
                                    onChange={(e) => handleChange("occupation", e.target.value)}
                                    placeholder="Enter occupation"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number *</Label>
                                <Input
                                    id="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                    placeholder="+234 XXX XXX XXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zone">Zone *</Label>
                                <Select
                                    value={formData.zone}
                                    onValueChange={(value) => handleChange("zone", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {surulereZones.map(zone => (
                                            <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    required
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    placeholder="Enter street address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Church Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Church Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department *</Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(value) => handleChange("department", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Training Completed</Label>
                            <div className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dcaBasic"
                                        checked={formData.attendedDcaBasic}
                                        onCheckedChange={(checked) => 
                                            handleChange("attendedDcaBasic", checked as boolean)
                                        }
                                    />
                                    <Label htmlFor="dcaBasic" className="cursor-pointer">DCA Basic</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dcaMaturity"
                                        checked={formData.attendedDcaMaturity}
                                        onCheckedChange={(checked) => 
                                            handleChange("attendedDcaMaturity", checked as boolean)
                                        }
                                    />
                                    <Label htmlFor="dcaMaturity" className="cursor-pointer">DCA Maturity</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dli"
                                        checked={formData.attendedDli}
                                        onCheckedChange={(checked) => 
                                            handleChange("attendedDli", checked as boolean)
                                        }
                                    />
                                    <Label htmlFor="dli" className="cursor-pointer">DLI</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Member"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}