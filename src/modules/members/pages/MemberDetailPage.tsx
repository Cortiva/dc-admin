import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, User, Award, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { useGetMemberByIdQuery, usePromoteMemberMutation } from "../memberApiSlice";
import { handleApiError } from "../../../utils/functions";
import { formatDate } from "date-fns/format";

export default function MemberDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [promoteMember] = usePromoteMemberMutation();

    const { data: member, isLoading } = useGetMemberByIdQuery(id!);

    const handlePromote = async () => {
        try {
            await promoteMember({
                memberId: id!,
                promotedBy: "system",
                notes: "Promoted to full member",
            }).unwrap();
            toast.success("Member promoted successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-40 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    if (!member) {
        return <div className="text-center py-12">Member not found</div>;
    }

    const isFullMember = member.isFullMember;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/members")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<User className="w-5 h-5" />}
                        title={member.fullName}
                        subtitle={`Member #${member.memberNumber}`}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/members/${id}/edit`)}>
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

            {/* Status Badge */}
            <div className="flex flex-wrap gap-2">
                {isFullMember ? (
                    <Badge variant="default" className="bg-green-500 text-white">Full Member</Badge>
                ) : (
                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                        {member.visitorStatus || "Visitor"}
                    </Badge>
                )}
                {member.isBeliever && (
                    <Badge variant="outline" className="text-purple-500 border-purple-500">Believer</Badge>
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

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Personal Information</h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Phone:</span> {member.phone}</p>
                        <p><span className="text-muted-foreground">Email:</span> {member.email || "—"}</p>
                        <p><span className="text-muted-foreground">Gender:</span> {member.gender || "—"}</p>
                        <p><span className="text-muted-foreground">Birthday:</span> {member.birthday ? formatDate(new Date(member.birthday), "PPP") : "—"}</p>
                        <p><span className="text-muted-foreground">Age:</span> {member.age || "—"}</p>
                        <p><span className="text-muted-foreground">Married:</span> {member.isMarried ? "Yes" : "No"}</p>
                    </div>
                </Card>

                <Card className="p-4 space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Home:</span> {member.homeAddress || "—"}</p>
                        <p><span className="text-muted-foreground">LGA:</span> {member.localGovernmentArea || "—"}</p>
                    </div>
                    <div className="pt-2 border-t border-muted/30">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Church Details</h4>
                        <p><span className="text-muted-foreground">Cell:</span> {member.cellName || "—"}</p>
                        <p><span className="text-muted-foreground">Department:</span> {member.departmentName || "—"}</p>
                        <p><span className="text-muted-foreground">Visits:</span> {member.visitCount || 0}</p>
                    </div>
                </Card>

                <Card className="p-4 space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Membership</h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Joined:</span> {formatDate(new Date(member.createdAt), "PPP")}</p>
                        {member.fullMemberAt && (
                            <p><span className="text-muted-foreground">Full Member Since:</span> {formatDate(new Date(member.fullMemberAt), "PPP")}</p>
                        )}
                        <p><span className="text-muted-foreground">Status:</span> {isFullMember ? "Full Member" : "Visitor"}</p>
                        {member.visitorStatus && (
                            <p><span className="text-muted-foreground">Visitor Status:</span> {member.visitorStatus}</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* DCA Attendance */}
            <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Dominion City Academy</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                        {member.attendedDCABasic ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm">DCA Basic</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {member.attendedDCAMerit ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm">DCA Merit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {member.attendedEncounter ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm">Encounter</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}