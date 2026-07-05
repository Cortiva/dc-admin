// modules/members/pages/MemberDetailPage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowLeft, Edit, User, Award, CheckCircle, XCircle, 
    Mail, Phone, MapPin, Calendar, Users, Building2, 
    UserCheck, UserX, Clock, Heart, MoreVertical,
    Copy, Share2, Download
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import { useGetMemberByIdQuery, usePromoteMemberMutation } from "../memberApiSlice";
import { handleApiError, getInitials } from "../../../utils/functions";
import type { MemberResponse } from "../../../types/member.type";

// ─── Sub-components ──────────────────────────────────────────────────────────

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

interface StatusBadgeProps {
    member: MemberResponse;
}

const StatusBadges = ({ member }: StatusBadgeProps) => (
    <div className="flex flex-wrap gap-2">
        {member.isFullMember ? (
            <Badge variant="default" className="bg-green-500 text-white">
                <UserCheck className="w-3 h-3 mr-1" />
                Full Member
            </Badge>
        ) : (
            <Badge variant="outline" className="text-blue-500 border-blue-500">
                <UserX className="w-3 h-3 mr-1" />
                {member.visitorStatus || "Visitor"}
            </Badge>
        )}
        {member.isBeliever && (
            <Badge variant="outline" className="text-purple-500 border-purple-500">
                <Heart className="w-3 h-3 mr-1" />
                Believer
            </Badge>
        )}
        {member.attendedDCABasic && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">DCA Basic</Badge>
        )}
        {member.attendedDCAMerit && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">DCA Merit</Badge>
        )}
        {member.attendedEncounter && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">Encounter</Badge>
        )}
    </div>
);

// ─── Custom Avatar Component ───────────────────────────────────────────────

interface CustomAvatarProps {
    src?: string | null;
    fallback: string;
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
    className?: string;
}

const CustomAvatar = ({ src, fallback, size = "lg", className = "" }: CustomAvatarProps) => {
    const sizeClasses = {
        sm: "w-12 h-12 text-sm",
        md: "w-20 h-20 text-lg",
        lg: "w-32 h-32 text-xl",
        xl: "w-60 h-60 text-3xl",
        xxl: "w-72 h-72 text-4xl",
    };

    return (
        <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-lg ${className}`}>
            {src ? (
                <img 
                    src={src} 
                    alt={fallback}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/30 via-primary/20 to-primary/5 flex items-center justify-center text-foreground font-bold">
                    {fallback}
                </div>
            )}
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MemberDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [promoteMember] = usePromoteMemberMutation();
    const [activeTab, setActiveTab] = useState("overview");
    
    // Get member from route state first
    const [member, setMember] = useState<MemberResponse | null>(
        location.state?.member || null
    );
    const [isLoadingMember, setIsLoadingMember] = useState(!member);
    const [error, setError] = useState<string | null>(null);

    // If no member in state, fetch by ID
    const { data: fetchedMember, isLoading: isFetching, isError } = useGetMemberByIdQuery(
        location.state?.member?.id || "",
        { skip: !!member || !location.state?.member?.id }
    );

    useEffect(() => {
        if (fetchedMember) {
            setMember(fetchedMember);
            setIsLoadingMember(false);
        }
        if (isError) {
            setError("Failed to load member details");
            setIsLoadingMember(false);
        }
    }, [fetchedMember, isError]);

    // Redirect if no member and no ID
    useEffect(() => {
        if (!location.state?.member && !location.state?.member?.id) {
            navigate("/members", { replace: true });
        }
    }, [location.state, navigate]);

    const isLoading = isLoadingMember || isFetching;

    const handlePromote = async () => {
        if (!member) return;
        try {
            await promoteMember({
                memberId: member.id,
                promotedBy: "system",
                notes: "Promoted to full member",
            }).unwrap();
            toast.success("Member promoted successfully");
            setMember({ ...member, isFullMember: true });
        } catch (error) {
            handleApiError(error);
        }
    };

    // ─── Loading State ──────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                        <Skeleton className="h-80 w-full rounded-2xl" />
                    </div>
                    <div className="lg:w-2/3 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <UserX className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Member Not Found</h3>
                    <p className="text-sm text-muted-foreground mb-6">{error || "The member you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate("/members")}>
                        Back to Members
                    </Button>
                </div>
            </div>
        );
    }

    const isFullMember = member.isFullMember;
    const fullName = `${member.firstName} ${member.lastName}`;

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* ─── Header ────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/members")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<User className="w-5 h-5" />}
                        title={fullName}
                        subtitle={`Member ID: ${member.memberNumber}`}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigator.clipboard?.writeText(member.id)}
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/members/edit", { state: { member } })}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    {!isFullMember && (
                        <Button onClick={handlePromote}>
                            <Award className="w-4 h-4 mr-2" />
                            Promote
                        </Button>
                    )}
                </div>
            </div>

            {/* ─── Profile Summary ──────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Card */}
                <div className="lg:w-1/3">
                    <Card className="p-6 text-center">
                        <div className="flex flex-col items-center">
                            <CustomAvatar
                                src={member.profileImageUrl}
                                fallback={getInitials(member.firstName, member.lastName)}
                                size="xxl"
                            />
                        </div>

                        <Separator className="my-4" />

                        <div className="text-left space-y-1">
                            <InfoItem 
                                label="Email" 
                                value={member.email || "Not provided"} 
                                icon={<Mail className="w-4 h-4" />}
                            />
                            <InfoItem 
                                label="Phone" 
                                value={member.phone} 
                                icon={<Phone className="w-4 h-4" />}
                            />
                            <InfoItem 
                                label="Gender" 
                                value={member.gender || "Not specified"} 
                                icon={<User className="w-4 h-4" />}
                            />
                            <InfoItem 
                                label="Married" 
                                value={member.isMarried ? "Yes" : "No"} 
                                icon={<Heart className="w-4 h-4" />}
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-muted/30">
                            <StatusBadges member={member} />
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="church">Church Details</TabsTrigger>
                            <TabsTrigger value="academy">DCA Progress</TabsTrigger>
                        </TabsList>

                        {/* ─── Overview Tab ──────────────────────────────── */}
                        <TabsContent value="overview" className="mt-4 space-y-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                    <InfoItem label="Full Name" value={fullName} />
                                    <InfoItem label="Member Number" value={member.memberNumber} />
                                    <InfoItem label="Phone" value={member.phone} />
                                    <InfoItem label="Email" value={member.email || "—"} />
                                    <InfoItem label="Gender" value={member.gender || "—"} />
                                    <InfoItem label="Birthday" value={member.birthday ? formatDate(new Date(member.birthday), "PPP") : "—"} />
                                    <InfoItem label="Age" value={member.age || "—"} />
                                    <InfoItem label="Married" value={member.isMarried ? "Yes" : "No"} />
                                    <InfoItem label="Wedding Date" value={member.weddingDate ? formatDate(new Date(member.weddingDate), "PPP") : "—"} />
                                    <InfoItem label="Home Address" value={member.homeAddress || "—"} />
                                    <InfoItem label="LGA" value={member.localGovernmentArea || "—"} />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Membership</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                    <InfoItem label="Status" value={isFullMember ? "Full Member" : "Visitor"} />
                                    <InfoItem label="Joined" value={formatDate(new Date(member.createdAt), "PPP")} />
                                    {member.fullMemberAt && (
                                        <InfoItem label="Full Member Since" value={formatDate(new Date(member.fullMemberAt), "PPP")} />
                                    )}
                                    <InfoItem label="Visit Count" value={member.visitCount || 0} />
                                    <InfoItem label="Visitor Status" value={member.visitorStatus || "—"} />
                                </div>
                            </Card>
                        </TabsContent>

                        {/* ─── Church Details Tab ─────────────────────────── */}
                        <TabsContent value="church" className="mt-4 space-y-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Church Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                    <InfoItem 
                                        label="Cell" 
                                        value={member.cellName || "Not assigned"} 
                                        icon={<Building2 className="w-4 h-4" />}
                                    />
                                    <InfoItem 
                                        label="Department" 
                                        value={member.departmentName || "Not assigned"} 
                                        icon={<Users className="w-4 h-4" />}
                                    />
                                    <InfoItem 
                                        label="Believer Status" 
                                        value={member.isBeliever ? "Yes" : "No"} 
                                        icon={<Heart className="w-4 h-4" />}
                                    />
                                    <InfoItem 
                                        label="Full Member" 
                                        value={isFullMember ? "Yes" : "No"} 
                                        icon={<UserCheck className="w-4 h-4" />}
                                    />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button variant="outline" className="justify-start" onClick={() => navigate("/members/edit", { state: { member } })}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Member
                                    </Button>
                                    {!isFullMember && (
                                        <Button variant="outline" className="justify-start" onClick={handlePromote}>
                                            <Award className="w-4 h-4 mr-2" />
                                            Promote to Full Member
                                        </Button>
                                    )}
                                    <Button variant="outline" className="justify-start">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call {member.firstName}
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email {member.firstName}
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* ─── DCA Progress Tab ───────────────────────────── */}
                        <TabsContent value="academy" className="mt-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Dominion City Academy Progress</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-4 p-4 rounded-lg border border-muted/30 bg-muted/5">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.attendedDCABasic ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {member.attendedDCABasic ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">DCA Basic</p>
                                            <p className="text-xs text-muted-foreground">{member.attendedDCABasic ? 'Completed' : 'Not yet'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-lg border border-muted/30 bg-muted/5">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.attendedDCAMerit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {member.attendedDCAMerit ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">DCA Merit</p>
                                            <p className="text-xs text-muted-foreground">{member.attendedDCAMerit ? 'Completed' : 'Not yet'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-lg border border-muted/30 bg-muted/5">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.attendedEncounter ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {member.attendedEncounter ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Encounter</p>
                                            <p className="text-xs text-muted-foreground">{member.attendedEncounter ? 'Completed' : 'Not yet'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-muted/30">
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Progress:</span> 
                                        {[member.attendedDCABasic, member.attendedDCAMerit, member.attendedEncounter].filter(Boolean).length} of 3 completed
                                    </p>
                                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                                            style={{ width: `${([member.attendedDCABasic, member.attendedDCAMerit, member.attendedEncounter].filter(Boolean).length / 3) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}