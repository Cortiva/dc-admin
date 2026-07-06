import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowLeft, Edit, User, Phone, Mail, 
    Calendar, Users, Award, CheckCircle,
    Clock, Copy, UserPlus
} from "lucide-react";
import { formatDate } from "date-fns";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import { getInitials } from "../../../utils/functions";
import type { VisitorProfileResponse } from "../../../types/visitor.types";

interface InfoItemProps {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
}

const InfoItem = ({ label, value, icon }: InfoItemProps) => (
    <div className="flex items-start gap-3 py-2 border-b border-muted/30 last:border-0">
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium truncate">{value || "—"}</p>
        </div>
    </div>
);

export default function VisitorDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get visitor data from state
    const visitor = location.state?.visitor as VisitorProfileResponse | undefined;

    // If no visitor data in state, redirect back to list
    if (!visitor) {
        navigate("/visitors", { replace: true });
        return null;
    }

    const lastVisit = visitor.visits?.[0]?.visitDate;

    const handleRecordVisit = () => {
        navigate("/visitors/check-in", { state: { visitor } });
    };

    const handleEdit = () => {
        navigate("/visitors/edit", { state: { visitor } });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/visitors")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<User />}
                        title={`${visitor.member.firstName} ${visitor.member.lastName}`}
                        subtitle={`${visitor.visitCount} visits`}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigator.clipboard?.writeText(visitor.memberId)}
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                    </Button>
                    <Button variant="outline" onClick={handleRecordVisit}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Record Visit
                    </Button>
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Card */}
                <div className="lg:w-1/3">
                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary/10">
                                <AvatarImage src={visitor.member.profileImageUrl || ""} />
                                <AvatarFallback className="text-2xl bg-linear-to-br from-primary/20 to-primary/5">
                                    {getInitials(visitor.member.firstName, visitor.member.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">
                                {visitor.member.firstName} {visitor.member.lastName}
                            </h2>
                            <Badge className="mt-1">{visitor.status}</Badge>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {visitor.visitCount} visits
                                </Badge>
                                {lastVisit && (
                                    <Badge variant="secondary" className="text-xs">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Last visit {formatDate(new Date(lastVisit), "MMM d")}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-left space-y-1">
                            <InfoItem label="Phone" value={visitor.member.phone} icon={<Phone className="w-4 h-4" />} />
                            <InfoItem label="Email" value={visitor.member.email || "Not provided"} icon={<Mail className="w-4 h-4" />} />
                            <InfoItem label="How Heard" value={visitor.howHeardAboutUs} icon={<Users className="w-4 h-4" />} />
                            <InfoItem label="Education" value={visitor.levelOfEducation} icon={<Award className="w-4 h-4" />} />
                            <InfoItem label="Would Return" value={visitor.preferenceToReturn ? "Yes" : "No"} icon={<CheckCircle className="w-4 h-4" />} />
                            <InfoItem label="Status" value={visitor.status} icon={<User className="w-4 h-4" />} />
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="visits">Visits ({visitor.visits?.length || 0})</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-4 space-y-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Visitor Information</h3>
                                <div className="grid grid-cols-1 gap-y-2">
                                    <InfoItem label="Member ID" value={visitor.memberId} />
                                    <InfoItem label="Full Name" value={`${visitor.member.firstName} ${visitor.member.lastName}`} />
                                    <InfoItem label="Phone" value={visitor.member.phone} />
                                    <InfoItem label="Email" value={visitor.member.email || "—"} />
                                    <InfoItem label="Gender" value={visitor.member.gender || "—"} />
                                    <InfoItem label="Status" value={visitor.status} />
                                    <InfoItem label="Visit Count" value={visitor.visitCount} />
                                    <InfoItem label="How Heard About Us" value={visitor.howHeardAboutUs} />
                                    <InfoItem label="Education Level" value={visitor.levelOfEducation} />
                                    <InfoItem label="Would Return" value={visitor.preferenceToReturn ? "Yes" : "No"} />
                                    {visitor.whatTheyLovedMost && (
                                        <InfoItem label="What They Loved Most" value={visitor.whatTheyLovedMost} />
                                    )}
                                    <InfoItem label="Recorded By" value={visitor.recordedBy?.member ? `${visitor.recordedBy.member.firstName} ${visitor.recordedBy.member.lastName}` : "—"} />
                                    <InfoItem label="First Visit" value={formatDate(new Date(visitor.createdAt), "PPP")} />
                                    <InfoItem label="Last Updated" value={formatDate(new Date(visitor.updatedAt), "PPP")} />
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Visits Tab */}
                        <TabsContent value="visits" className="mt-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                    Visit History ({visitor.visits?.length || 0})
                                </h3>

                                {visitor.visits?.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No visits recorded</p>
                                        <p className="text-sm">Record a visit for this visitor</p>
                                        <Button 
                                            variant="outline" 
                                            className="mt-4"
                                            onClick={handleRecordVisit}
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Record Visit
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {visitor.visits.map((visit: any) => (
                                            <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg border border-muted/30 hover:bg-muted/20 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {visit.serviceType}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(new Date(visit.visitDate), "PPP")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">
                                                        Recorded by: {visit.recordedBy?.member ? `${visit.recordedBy.member.firstName} ${visit.recordedBy.member.lastName}` : "—"}
                                                    </p>
                                                    {visit.notes && (
                                                        <p className="text-xs text-muted-foreground mt-1">📝 {visit.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}