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
    TrendingUp,
    Users,
    Award,
    Clock,
    UserPlus,
} from "lucide-react";
import type { Visitor } from "../../../mock/visitors-mock-data";
import { InfoRows } from "./InfoRow";

interface ViewVisitorProps {
    isOpen: boolean;
    onClose: () => void;
    visitor: Visitor | null;
}

export function ViewVisitor({ isOpen, onClose, visitor }: ViewVisitorProps) {
    if (!visitor) return null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    };

    const getInterestColor = (percentage: number) => {
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-blue-600";
        if (percentage >= 40) return "text-yellow-600";
        return "text-gray-600";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Visitor Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-6 bg-linear-to-r from-primary/10 to-transparent rounded-xl">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={visitor.avatar} alt={visitor.fullName} />
                            <AvatarFallback className="text-2xl">{getInitials(visitor.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{visitor.fullName}</h2>
                                    <div className="flex gap-2 mt-2">
                                        {visitor.isFirstTimer && <Badge className="bg-green-100 text-green-800">First Timer</Badge>}
                                        {visitor.isSecondTimer && <Badge className="bg-blue-100 text-blue-800">Second Timer</Badge>}
                                        {visitor.enrolledForDca && <Badge className="bg-purple-100 text-purple-800">Enrolled in DCA</Badge>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-3xl font-bold ${getInterestColor(visitor.interestPercentage)}`}>
                                        {visitor.interestPercentage}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">Interest Level</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRows
                            icon={<Phone className="w-5 h-5" />}
                            label="Phone Number"
                            value={visitor.phoneNumber}
                        />
                        <InfoRows
                            icon={<MapPin className="w-5 h-5" />}
                            label="Address"
                            value={`${visitor.address}, ${visitor.zone}, Surulere, Lagos`}
                        />
                        <InfoRows
                            icon={<Users className="w-5 h-5" />}
                            label="Gender"
                            value={visitor.gender}
                        />
                        <InfoRows
                            icon={<Briefcase className="w-5 h-5" />}
                            label="Occupation"
                            value={visitor.occupation}
                        />
                        <InfoRows
                            icon={<Calendar className="w-5 h-5" />}
                            label="Date of Birth"
                            value={new Date(visitor.dateOfBirth).toLocaleDateString()}
                        />
                        <InfoRows
                            icon={<Clock className="w-5 h-5" />}
                            label="Visit History"
                            value={
                                <div>
                                    <div>First Visit: {new Date(visitor.firstVisitDate).toLocaleDateString()}</div>
                                    <div>Last Visit: {new Date(visitor.lastVisitDate).toLocaleDateString()}</div>
                                    <div>Total: {visitor.visitCount} {visitor.visitCount === 1 ? 'visit' : 'visits'}</div>
                                </div>
                            }
                        />
                        <InfoRows
                            icon={<UserPlus className="w-5 h-5" />}
                            label="Referred By"
                            value={visitor.referredBy}
                        />
                        <InfoRows
                            icon={<Award className="w-5 h-5" />}
                            label="DCA Enrollment"
                            value={
                                visitor.enrolledForDca ? (
                                    <Badge className="bg-purple-100 text-purple-800">Enrolled</Badge>
                                ) : (
                                    <span className="text-muted-foreground">Not enrolled</span>
                                )
                            }
                        />
                        <InfoRows
                            icon={<TrendingUp className="w-5 h-5" />}
                            label="Interest & Engagement"
                            value={
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span>Interest Level:</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-primary rounded-full h-2" 
                                                style={{ width: `${visitor.interestPercentage}%` }}
                                            />
                                        </div>
                                        <span className="font-semibold">{visitor.interestPercentage}%</span>
                                    </div>
                                    <div>
                                        {visitor.hasBeenEngaged ? (
                                            <Badge className="bg-green-100 text-green-800">Has been engaged</Badge>
                                        ) : (
                                            <Badge variant="outline">Not yet engaged</Badge>
                                        )}
                                    </div>
                                </div>
                            }
                        />
                    </div>

                    {/* Follow-up Recommendations */}
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold mb-2">Follow-up Recommendations</h3>
                        {visitor.interestPercentage >= 80 && !visitor.enrolledForDca && (
                            <p className="text-sm">✓ High interest - Consider DCA enrollment follow-up</p>
                        )}
                        {!visitor.hasBeenEngaged && (
                            <p className="text-sm">✓ Schedule a welcome call or visit</p>
                        )}
                        {visitor.isFirstTimer && (
                            <p className="text-sm">✓ Send welcome package and invitation to next service</p>
                        )}
                        {visitor.visitCount > 1 && visitor.interestPercentage < 60 && (
                            <p className="text-sm">✓ Low engagement risk - Assign to follow-up team</p>
                        )}
                        {visitor.referredBy && visitor.referredBy !== "Online Ad" && (
                            <p className="text-sm">✓ Connect with referrer ({visitor.referredBy}) for introduction</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}