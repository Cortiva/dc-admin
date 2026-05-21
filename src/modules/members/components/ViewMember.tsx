import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
    MapPin,
    Phone,
    Calendar,
    Briefcase,
    Heart,
    Users,
    GraduationCap,
} from "lucide-react";
import type { Member } from "../../../types/member.type";
import { InfoRows } from "./InfoRow";

interface ViewMemberProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
}

export function ViewMember({ isOpen, onClose, member }: ViewMemberProps) {
    if (!member) return null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Member Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-6 bg-linear-to-r from-primary/10 to-transparent rounded-xl">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={member.avatar} alt={member.fullName} />
                            <AvatarFallback className="text-2xl">{getInitials(member.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{member.fullName}</h2>
                            <div className="flex gap-2 mt-2">
                                <Badge>{member.department}</Badge>
                                <Badge variant="outline">{member.zone}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRows
                            icon={<Phone className="w-5 h-5" />}
                            label="Phone Number"
                            value={member.phoneNumber}
                        />
                        <InfoRows
                            icon={<MapPin className="w-5 h-5" />}
                            label="Address"
                            value={`${member.address}, ${member.zone}, Surulere, Lagos`}
                        />
                        <InfoRows
                            icon={<Users className="w-5 h-5" />}
                            label="Gender"
                            value={member.gender}
                        />
                        <InfoRows
                            icon={<Heart className="w-5 h-5" />}
                            label="Marital Status"
                            value={member.maritalStatus}
                        />
                        <InfoRows
                            icon={<Calendar className="w-5 h-5" />}
                            label="Date of Birth"
                            value={new Date(member.dateOfBirth).toLocaleDateString()}
                        />
                        {member.weddingDate && (
                            <InfoRows
                                icon={<Calendar className="w-5 h-5" />}
                                label="Wedding Date"
                                value={new Date(member.weddingDate).toLocaleDateString()}
                            />
                        )}
                        <InfoRows
                            icon={<Briefcase className="w-5 h-5" />}
                            label="Occupation"
                            value={member.occupation}
                        />
                        <InfoRows
                            icon={<GraduationCap className="w-5 h-5" />}
                            label="Training Completed"
                            value={
                                <div className="flex gap-2 mt-1">
                                    {member.attendedDcaBasic && <Badge className="bg-green-100 text-green-800">DCA Basic</Badge>}
                                    {member.attendedDcaMaturity && <Badge className="bg-blue-100 text-blue-800">DCA Maturity</Badge>}
                                    {member.attendedDli && <Badge className="bg-purple-100 text-purple-800">DLI</Badge>}
                                    {!member.attendedDcaBasic && !member.attendedDcaMaturity && !member.attendedDli && (
                                        <span className="text-muted-foreground">No training completed</span>
                                    )}
                                </div>
                            }
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}