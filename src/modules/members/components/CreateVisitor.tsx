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
import { visitorDepartments, visitorZones } from "../../../mock/visitors-mock-data";

interface CreateVisitorProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface VisitorFormData {
    fullName: string;
    address: string;
    zone: string;
    phoneNumber: string;
    gender: string;
    maritalStatus: string;
    dateOfBirth: string;
    occupation: string;
    isFirstTimer: boolean;
    isSecondTimer: boolean;
    hasBeenEngaged: boolean;
    interestPercentage: number;
    enrolledForDca: boolean;
    referredBy: string;
    department: string;
}

export default function CreateVisitor({ isOpen, onClose, onSuccess }: CreateVisitorProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<VisitorFormData>({
        fullName: "",
        address: "",
        zone: "",
        phoneNumber: "",
        gender: "Male",
        maritalStatus: "Single",
        dateOfBirth: "",
        occupation: "",
        isFirstTimer: true,
        isSecondTimer: false,
        hasBeenEngaged: false,
        interestPercentage: 50,
        enrolledForDca: false,
        referredBy: "",
        department: "None",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("New visitor:", formData);
        setIsSubmitting(false);
        onSuccess();
        onClose();
        setFormData({
            fullName: "",
            address: "",
            zone: "",
            phoneNumber: "",
            gender: "Male",
            maritalStatus: "Single",
            dateOfBirth: "",
            occupation: "",
            isFirstTimer: true,
            isSecondTimer: false,
            hasBeenEngaged: false,
            interestPercentage: 50,
            enrolledForDca: false,
            referredBy: "",
            department: "None",
        });
    };

    const handleChange = <K extends keyof VisitorFormData>(
        field: K,
        value: VisitorFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Auto-set second timer to false if first timer is true
        if (field === 'isFirstTimer' && value === true) {
            setFormData(prev => ({ ...prev, isSecondTimer: false }));
        }
        // Auto-set first timer to false if second timer is true
        if (field === 'isSecondTimer' && value === true) {
            setFormData(prev => ({ ...prev, isFirstTimer: false }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Visitor</DialogTitle>
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
                                        {visitorZones.map(zone => (
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

                    {/* Visitor Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Visitor Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Visitor Type</Label>
                                <div className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="firstTimer"
                                            checked={formData.isFirstTimer}
                                            onCheckedChange={(checked) => 
                                                handleChange("isFirstTimer", checked as boolean)
                                            }
                                        />
                                        <Label htmlFor="firstTimer">First Timer</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="secondTimer"
                                            checked={formData.isSecondTimer}
                                            onCheckedChange={(checked) => 
                                                handleChange("isSecondTimer", checked as boolean)
                                            }
                                        />
                                        <Label htmlFor="secondTimer">Second Timer</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="referredBy">Referred By</Label>
                                <Input
                                    id="referredBy"
                                    value={formData.referredBy}
                                    onChange={(e) => handleChange("referredBy", e.target.value)}
                                    placeholder="Friend, Social media, etc."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="interestPercentage">Interest Percentage</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="interestPercentage"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.interestPercentage}
                                        onChange={(e) => handleChange("interestPercentage", parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <span className="w-12 text-center font-semibold">{formData.interestPercentage}%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department Interest</Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(value) => handleChange("department", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {visitorDepartments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="hasBeenEngaged"
                                    checked={formData.hasBeenEngaged}
                                    onCheckedChange={(checked) => 
                                        handleChange("hasBeenEngaged", checked as boolean)
                                    }
                                />
                                <Label htmlFor="hasBeenEngaged">Has been engaged/followed up</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="enrolledForDca"
                                    checked={formData.enrolledForDca}
                                    onCheckedChange={(checked) => 
                                        handleChange("enrolledForDca", checked as boolean)
                                    }
                                />
                                <Label htmlFor="enrolledForDca">Enrolled for DCA</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Visitor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}