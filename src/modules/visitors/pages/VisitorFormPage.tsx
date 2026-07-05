import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { useGetVisitorByMemberIdQuery, useUpdateVisitorProfileMutation } from "../visitorApiSlice";
import { handleApiError } from "../../../utils/functions";
import { apiSlice } from "../../../store/apiSlice";
import type { VisitorProfileResponse } from "../../../types/visitor.types";
import { Badge } from "../../../components/ui/badge";

export default function VisitorFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { memberId } = useParams<{ memberId: string }>();

    // Get visitor from route state or fetch by ID
    const visitorFromState = location.state?.visitor as VisitorProfileResponse | undefined;
    const [visitor, setVisitor] = useState<VisitorProfileResponse | null>(visitorFromState || null);
    const [isLoading, setIsLoading] = useState(!visitorFromState);

    const { data: fetchedVisitor, isLoading: isFetching, isError } = useGetVisitorByMemberIdQuery(
        memberId!,
        { skip: !!visitorFromState || !memberId }
    );

    const [updateVisitorProfile, { isLoading: isUpdating }] = useUpdateVisitorProfileMutation();

    const [formData, setFormData] = useState({
        howHeardAboutUs: visitor?.howHeardAboutUs || "",
        levelOfEducation: visitor?.levelOfEducation || "",
        preferenceToReturn: visitor?.preferenceToReturn || false,
        whatTheyLovedMost: visitor?.whatTheyLovedMost || "",
    });

    useEffect(() => {
        if (fetchedVisitor) {
            setVisitor(fetchedVisitor);
            setIsLoading(false);
            setFormData({
                howHeardAboutUs: fetchedVisitor.howHeardAboutUs || "",
                levelOfEducation: fetchedVisitor.levelOfEducation || "",
                preferenceToReturn: fetchedVisitor.preferenceToReturn || false,
                whatTheyLovedMost: fetchedVisitor.whatTheyLovedMost || "",
            });
        }
        if (isError) {
            toast.error("Failed to load visitor profile");
            setIsLoading(false);
        }
    }, [fetchedVisitor, isError]);

    // Redirect if no visitor and no ID
    useEffect(() => {
        if (!location.state?.visitor && !memberId) {
            navigate("/visitors", { replace: true });
        }
    }, [location.state, memberId, navigate]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const refetchVisitors = async () => {
        dispatch(apiSlice.util.invalidateTags(["Visitors"]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data: any = {};
            if (formData.howHeardAboutUs) data.howHeardAboutUs = formData.howHeardAboutUs;
            if (formData.levelOfEducation) data.levelOfEducation = formData.levelOfEducation;
            if (formData.preferenceToReturn !== undefined) data.preferenceToReturn = formData.preferenceToReturn;
            if (formData.whatTheyLovedMost !== undefined) data.whatTheyLovedMost = formData.whatTheyLovedMost;

            const memberIdToUse = visitor?.memberId || memberId;
            await updateVisitorProfile({ memberId: memberIdToUse!, data }).unwrap();
            toast.success("Visitor profile updated successfully");
            await refetchVisitors();
            navigate("/visitors");
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                </div>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    if (!visitor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Visitor Not Found</h3>
                    <p className="text-sm text-muted-foreground mb-6">The visitor profile you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/visitors")}>Back to Visitors</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/visitors")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title="Edit Visitor Profile"
                    subtitle={`Update visitor information for ${visitor.member.firstName} ${visitor.member.lastName}`}
                />
            </div>

            {/* Visitor Info Card */}
            <Card className="p-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium">
                            {visitor.member.firstName.charAt(0)}{visitor.member.lastName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium">
                                {visitor.member.firstName} {visitor.member.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {visitor.member.phone} • {visitor.visitCount} visits
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                        <Badge variant="secondary">{visitor.status}</Badge>
                        <Badge variant="outline">{visitor.howHeardAboutUs}</Badge>
                    </div>
                </div>
            </Card>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="howHeardAboutUs">How Heard About Us</Label>
                            <Select
                                value={formData.howHeardAboutUs}
                                onValueChange={(value) => handleChange("howHeardAboutUs", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select how they heard" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                                    <SelectItem value="FRIEND_OR_FAMILY">Friend or Family</SelectItem>
                                    <SelectItem value="CHURCH_MEMBER">Church Member</SelectItem>
                                    <SelectItem value="FLYER_OR_BANNER">Flyer or Banner</SelectItem>
                                    <SelectItem value="WEBSITE">Website</SelectItem>
                                    <SelectItem value="WALK_IN">Walk-in</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="levelOfEducation">Education Level</Label>
                            <Select
                                value={formData.levelOfEducation}
                                onValueChange={(value) => handleChange("levelOfEducation", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NO_FORMAL_EDUCATION">No Formal Education</SelectItem>
                                    <SelectItem value="PRIMARY">Primary</SelectItem>
                                    <SelectItem value="SECONDARY">Secondary</SelectItem>
                                    <SelectItem value="TERTIARY">Tertiary</SelectItem>
                                    <SelectItem value="POSTGRADUATE">Postgraduate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="preferenceToReturn"
                                checked={formData.preferenceToReturn}
                                onCheckedChange={(checked) => handleChange("preferenceToReturn", checked)}
                            />
                            <Label htmlFor="preferenceToReturn" className="cursor-pointer">
                                Would Return
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatTheyLovedMost">What They Loved Most</Label>
                            <Textarea
                                id="whatTheyLovedMost"
                                value={formData.whatTheyLovedMost}
                                onChange={(e) => handleChange("whatTheyLovedMost", e.target.value)}
                                placeholder="What did the visitor enjoy most about their experience?"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/visitors")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Update Profile
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}