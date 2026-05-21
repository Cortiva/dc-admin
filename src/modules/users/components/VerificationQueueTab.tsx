// components/admin/users/VerificationQueueTab.tsx
"use client";

import { useState, useMemo } from "react";
import {
    Shield,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    RefreshCw,
    Clock,
    Building2,
    Banknote,
    FileCheck,
    AlertCircle,
    Loader2,
    Mail,
    Phone,
} from "lucide-react";
import type { VerificationQueueItem } from "../types/user.type";
import type { ArtisanVerificationFilterParams } from "../types/user.type";
import { useBulkVerifyArtisansMutation, useFetchVerificationQueueQuery, useVerifyArtisanMutation } from "../userApiSlice";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { Progress } from "../../../components/ui/progress";
import AppPagination from "../../../components/AppPagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";

export default function VerificationQueueTab() {
    const [filters, setFilters] = useState<ArtisanVerificationFilterParams>({
        page: 1,
        limit: 20,
        status: "pending",
        sortBy: "createdAt",
        sortOrder: "asc",
    });
    const [selectedArtisan, setSelectedArtisan] = useState<VerificationQueueItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verificationNotes, setVerificationNotes] = useState("");
    const [verificationStatus, setVerificationStatus] = useState<"verified" | "rejected">("verified");
    const [selectedArtisans, setSelectedArtisans] = useState<string[]>([]);
    const [isBulkMode, setIsBulkMode] = useState(false);

    const { data: response, isLoading, refetch } = useFetchVerificationQueueQuery(filters);
    const [verifyArtisan, { isLoading: isVerifying }] = useVerifyArtisanMutation();
    const [bulkVerifyArtisans, { isLoading: isBulkVerifying }] = useBulkVerifyArtisansMutation();

    const artisans = useMemo(() => response?.data?.artisans || [], [response?.data?.artisans]);
    const summary = useMemo(() => response?.data?.summary || {}, [response?.data?.summary]);
    const pagination = useMemo(() => response?.data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }, [response?.data?.pagination]);

    const handleSearch = (search: string) => {
        setFilters(prev => ({ ...prev, search, page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setFilters(prev => ({ ...prev, status: status as unknown as ArtisanVerificationFilterParams['status'], page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({ ...prev, limit, page: 1 }));
    };

    const handleViewDetails = (artisan: VerificationQueueItem) => {
        setSelectedArtisan(artisan);
        setIsDetailModalOpen(true);
    };

    const handleVerify = async () => {
        if (!selectedArtisan) return;

        try {
            await verifyArtisan({
                artisanId: selectedArtisan.id,
                data: {
                    status: verificationStatus,
                    notes: verificationNotes,
                    sendNotification: true,
                },
            }).unwrap();

            toast.success(`Artisan ${verificationStatus === "verified" ? "verified" : "rejected"} successfully`);

            setIsVerifyModalOpen(false);
            setVerificationNotes("");
            refetch();
        } catch (error) {
            console.error("Verification error:", error);
            handleApiError(error);
        }
    };

    const handleBulkVerify = async () => {
        if (selectedArtisans.length === 0) return;

        try {
            await bulkVerifyArtisans({
                artisanIds: selectedArtisans,
                status: "verified",
                notes: "Bulk verification completed",
            }).unwrap();

            toast.success(`${selectedArtisans.length} artisan(s) verified successfully`);

            setSelectedArtisans([]);
            setIsBulkMode(false);
            refetch();
        } catch (error) {
            console.error("Bulk verification error:", error);
            handleApiError(error);
        }
    };

    const toggleSelectArtisan = (artisanId: string) => {
        setSelectedArtisans(prev =>
            prev.includes(artisanId)
                ? prev.filter(id => id !== artisanId)
                : [...prev, artisanId]
        );
    };

    const selectAll = () => {
        if (selectedArtisans.length === artisans.length) {
            setSelectedArtisans([]);
        } else {
            setSelectedArtisans(artisans.map((a: VerificationQueueItem) => a.id));
        }
    };

    const getReadinessColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getReadinessProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending</p>
                            <p className="text-2xl font-bold">{summary.pending || 0}</p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500 opacity-50" />
                    </div>
                </Card>
                <Card className="p-4 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">In Review</p>
                            <p className="text-2xl font-bold">{summary.inReview || 0}</p>
                        </div>
                        <Eye className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                </Card>
                <Card className="p-4 bg-linear-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Verified Today</p>
                            <p className="text-2xl font-bold">{summary.verifiedToday || 0}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                    </div>
                </Card>
                <Card className="p-4 bg-linear-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Rejected Today</p>
                            <p className="text-2xl font-bold">{summary.rejectedToday || 0}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500 opacity-50" />
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Filters Bar */}
                <div className="p-4 border-b border-border">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or artisan code..."
                                    value={filters.search || ""}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={filters.status || "pending"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-37.5">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_review">In Review</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>

                            {selectedArtisans.length > 0 && (
                                <Button onClick={handleBulkVerify} disabled={isBulkVerifying}>
                                    {isBulkVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Verify {selectedArtisans.length}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Verification Queue Table */}
                {isLoading ? (
                    <VerificationQueueSkeleton />
                ) : artisans.length === 0 ? (
                    <div className="text-center py-12">
                        <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No verification requests found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        {isBulkMode && (
                                            <th className="px-4 py-3 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedArtisans.length === artisans.length}
                                                    onChange={selectAll}
                                                    className="rounded border-border"
                                                />
                                            </th>
                                        )}
                                        <th className="text-left px-4 py-3 text-xs font-medium uppercase">Artisan</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium uppercase">Contact</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium uppercase">Skills</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium uppercase">Readiness</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium uppercase">Submitted</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {artisans.map((artisan: VerificationQueueItem) => (
                                        <tr key={artisan.id} className="hover:bg-muted/30 transition-colors">
                                            {isBulkMode && (
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedArtisans.includes(artisan.id)}
                                                        onChange={() => toggleSelectArtisan(artisan.id)}
                                                        className="rounded border-border"
                                                    />
                                                </td>
                                            )}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={artisan.user.avatar} />
                                                        <AvatarFallback>
                                                            {artisan.user.firstName?.[0]}{artisan.user.lastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{artisan.user.firstName} {artisan.user.lastName}</p>
                                                        <p className="text-xs font-mono text-muted-foreground">{artisan.artisanCode}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="text-sm">{artisan.user.email}</p>
                                                    <p className="text-xs text-muted-foreground">{artisan.user.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {artisan.skills.slice(0, 2).map((skill, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {skill.category.name}
                                                        </Badge>
                                                    ))}
                                                    {artisan.skills.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{artisan.skills.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className={getReadinessColor(artisan.readinessScore)}>
                                                            {artisan.readinessScore}%
                                                        </span>
                                                        {artisan.missingRequirements.length > 0 && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{artisan.missingRequirements.length} missing requirements</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                    <Progress 
                                                        value={artisan.readinessScore} 
                                                        className={getReadinessProgressColor(artisan.readinessScore)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm">{new Date(artisan.user.createdAt).toLocaleDateString()}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(artisan.user.createdAt).toLocaleTimeString()}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(artisan)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedArtisan(artisan);
                                                            setVerificationStatus("verified");
                                                            setIsVerifyModalOpen(true);
                                                        }}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedArtisan(artisan);
                                                            setVerificationStatus("rejected");
                                                            setIsVerifyModalOpen(true);
                                                        }}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                                {/* Pagination */}
                        {pagination.totalPages > 0 && (
                            <AppPagination
                                currentPage={pagination.page}
                                totalItems={pagination.total}
                                pageSize={pagination.limit}
                                onPageChange={(p) => handlePageChange(p)}
                                onLimitChange={(l) => handleLimitChange(l)}
                            />
                        )}
                    </>
                )}
            </Card>

            {/* Bulk Mode Toggle */}
            {artisans.length > 0 && (
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsBulkMode(!isBulkMode);
                            if (!isBulkMode) setSelectedArtisans([]);
                        }}
                    >
                        {isBulkMode ? "Exit Bulk Mode" : "Bulk Actions"}
                    </Button>
                </div>
            )}

            {/* Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Verification Request Details</DialogTitle>
                    </DialogHeader>
                    {selectedArtisan && (
                        <div className="space-y-4">
                            {/* Artisan Info */}
                            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">
                                        {selectedArtisan.user.firstName?.[0]}{selectedArtisan.user.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {selectedArtisan.user.firstName} {selectedArtisan.user.lastName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{selectedArtisan.artisanCode}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-3 h-3" />
                                        <span className="text-xs">{selectedArtisan.user.email}</span>
                                        <Phone className="w-3 h-3 ml-2" />
                                        <span className="text-xs">{selectedArtisan.user.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Skills & Categories
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedArtisan.skills.map((skill, idx) => (
                                        <Badge key={idx} variant="outline">{skill.category.name}</Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Bank Accounts */}
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Banknote className="w-4 h-4" />
                                    Bank Accounts
                                </h4>
                                {selectedArtisan.bankAccounts.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedArtisan.bankAccounts.map((bank, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                                <div>
                                                    <p className="font-medium">{bank.bankName}</p>
                                                    <p className="text-sm text-muted-foreground">{bank.accountNumber}</p>
                                                </div>
                                                {bank.isDefault && <Badge variant="outline">Default</Badge>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No bank accounts linked</p>
                                )}
                            </div>

                            {/* Certifications */}
                            {selectedArtisan.certifications && selectedArtisan.certifications.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <FileCheck className="w-4 h-4" />
                                        Certifications
                                    </h4>
                                    <div className="space-y-1">
                                        {selectedArtisan.certifications.map((cert, idx) => (
                                            <p key={idx} className="text-sm">• {cert.title}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Readiness Score */}
                            <div>
                                <h4 className="font-semibold mb-2">Readiness Assessment</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span>Overall Score</span>
                                        <span className={getReadinessColor(selectedArtisan.readinessScore)}>
                                            {selectedArtisan.readinessScore}%
                                        </span>
                                    </div>
                                    <Progress 
                                        value={selectedArtisan.readinessScore} 
                                        className={getReadinessProgressColor(selectedArtisan.readinessScore)}
                                    />
                                    {selectedArtisan.missingRequirements.length > 0 && (
                                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Missing Requirements:</p>
                                            <ul className="list-disc list-inside text-sm mt-1">
                                                {selectedArtisan.missingRequirements.map((req, idx) => (
                                                    <li key={idx}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Verify Modal */}
            <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {verificationStatus === "verified" ? "Verify Artisan" : "Reject Artisan"}
                        </DialogTitle>
                        <DialogDescription>
                            {verificationStatus === "verified"
                                ? "Confirm that this artisan meets all verification requirements."
                                : "Please provide a reason for rejecting this verification request."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Notes (Optional)</Label>
                            <Textarea
                                placeholder={verificationStatus === "verified"
                                    ? "Add any verification notes..."
                                    : "Explain why this request is being rejected..."}
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={isVerifying}
                            variant={verificationStatus === "verified" ? "default" : "destructive"}
                        >
                            {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {verificationStatus === "verified" ? "Verify Artisan" : "Reject Request"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function VerificationQueueSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}