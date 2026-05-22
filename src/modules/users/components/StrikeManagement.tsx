// "use client";

// import { useState, useMemo } from "react";
// import {
//     AlertTriangle,
//     Search,
//     Plus,
//     Trash2,
//     Calendar,
//     User,
//     Flag,
//     Clock,
//     Shield,
//     AlertCircle,
//     Loader2,
// } from "lucide-react";
// import type { Strike, StrikeSummary } from "../types/user.type";
// import { useAddStrikeMutation, useFetchArtisanStrikesQuery, useRemoveStrikeMutation } from "../userApiSlice";
// import { toast } from "react-toastify";
// import { handleApiError } from "../../../utils/functions";
// import { Badge } from "../../../components/ui/badge";
// import { Card } from "../../../components/ui/card";
// import { Label } from "../../../components/ui/label";
// import { Input } from "../../../components/ui/input";
// import { Button } from "../../../components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
// import { Textarea } from "../../../components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
// import { Skeleton } from "../../../components/ui/skeleton";

// export default function StrikeManagementTab() {
//     const [searchArtisanId, setSearchArtisanId] = useState("");
//     const [artisanId, setArtisanId] = useState<string | null>(null);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
//     const [selectedStrike, setSelectedStrike] = useState<Strike | null>(null);
//     const [newStrike, setNewStrike] = useState({
//         reason: "",
//         severity: "minor" as "minor" | "major" | "critical",
//         expiresAt: "",
//         metadata: {} as Record<string, unknown>,
//     });

//     const { data: response, isLoading, refetch } = useFetchArtisanStrikesQuery(artisanId || "", {
//         skip: !artisanId,
//     });
//     const [addStrike, { isLoading: isAdding }] = useAddStrikeMutation();
//     const [removeStrike, { isLoading: isRemoving }] = useRemoveStrikeMutation();

//     const strikes = useMemo(() => response?.data?.strikes || [], [response?.data?.strikes]);
//     const summary: StrikeSummary | null = useMemo(() => response?.data, [response?.data]);

//     const handleSearch = () => {
//         if (searchArtisanId.trim()) {
//             setArtisanId(searchArtisanId.trim());
//         }
//     };

//     const handleAddStrike = async () => {
//         if (!artisanId) return;

//         try {
//             await addStrike({
//                 artisanId,
//                 ...newStrike,
//                 expiresAt: newStrike.expiresAt || undefined,
//             }).unwrap();

//             toast.success("Strike issued successfully");

//             setIsAddModalOpen(false);
//             setNewStrike({
//                 reason: "",
//                 severity: "minor",
//                 expiresAt: "",
//                 metadata: {},
//             });
//             refetch();
//         } catch (error) {
//             console.error("Error adding strike:", error);
//             handleApiError(error);
//         }
//     };

//     const handleRemoveStrike = async () => {
//         if (!selectedStrike) return;

//         try {
//             await removeStrike(selectedStrike.id).unwrap();

//             toast.success("Strike removed successfully");

//             setIsRemoveDialogOpen(false);
//             setSelectedStrike(null);
//             refetch();
//         } catch (error) {
//             console.error("Error removing strike:", error);
//             handleApiError(error);
//         }
//     };

//     const getSeverityBadge = (severity: string) => {
//         switch (severity) {
//             case "minor":
//                 return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Minor</Badge>;
//             case "major":
//                 return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Major</Badge>;
//             case "critical":
//                 return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Critical</Badge>;
//             default:
//                 return <Badge variant="secondary">{severity}</Badge>;
//         }
//     };

//     // const getSeverityValue = (severity: string) => {
//     //     switch (severity) {
//     //         case "minor": return 1;
//     //         case "major": return 2;
//     //         case "critical": return 3;
//     //         default: return 1;
//     //     }
//     // };

//     const isStrikeExpired = (expiresAt?: string) => {
//         if (!expiresAt) return false;
//         return new Date(expiresAt) < new Date();
//     };

//     return (
//         <div className="space-y-6">
//             {/* Search Section */}
//             <Card className="p-6">
//                 <div className="flex items-center gap-4">
//                     <div className="flex-1">
//                         <Label>Artisan ID or Code</Label>
//                         <div className="flex gap-2 mt-1">
//                             <Input
//                                 placeholder="Enter artisan ID or artisan code..."
//                                 value={searchArtisanId}
//                                 onChange={(e) => setSearchArtisanId(e.target.value)}
//                                 onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                             />
//                             <Button onClick={handleSearch} disabled={!searchArtisanId.trim()}>
//                                 <Search className="w-4 h-4 mr-2" />
//                                 Search
//                             </Button>
//                         </div>
//                     </div>
//                     {artisanId && (
//                         <Button
//                             variant="outline"
//                             onClick={() => setIsAddModalOpen(true)}
//                             className="mt-6"
//                         >
//                             <Plus className="w-4 h-4 mr-2" />
//                             Add Strike
//                         </Button>
//                     )}
//                 </div>
//             </Card>

//             {artisanId && (
//                 <>
//                     {isLoading ? (
//                         <StrikeManagementSkeleton />
//                     ) : (
//                         <>
//                             {/* Strike Summary */}
//                             {summary && (
//                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                                     <Card className={`p-4 ${summary.isSuspended ? "bg-red-50 dark:bg-red-950/20" : "bg-card"}`}>
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="text-sm text-muted-foreground">Total Strikes</p>
//                                                 <p className={`text-2xl font-bold ${summary.isSuspended ? "text-red-600" : ""}`}>
//                                                     {summary.totalStrikes} / {summary.strikeLimit}
//                                                 </p>
//                                             </div>
//                                             <Flag className={`w-8 h-8 ${summary.isSuspended ? "text-red-500" : "text-muted-foreground"} opacity-50`} />
//                                         </div>
//                                     </Card>
//                                     <Card className="p-4">
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="text-sm text-muted-foreground">Total Strike Value</p>
//                                                 <p className="text-2xl font-bold">{summary.totalStrikeValue}</p>
//                                             </div>
//                                             <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-50" />
//                                         </div>
//                                     </Card>
//                                     <Card className="p-4">
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="text-sm text-muted-foreground">Strike Limit</p>
//                                                 <p className="text-2xl font-bold">{summary.strikeLimit}</p>
//                                             </div>
//                                             <Shield className="w-8 h-8 text-blue-500 opacity-50" />
//                                         </div>
//                                     </Card>
//                                     <Card className="p-4">
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="text-sm text-muted-foreground">Status</p>
//                                                 <Badge variant={summary.isSuspended ? "destructive" : "default"} className="mt-1">
//                                                     {summary.isSuspended ? "Suspended" : "Active"}
//                                                 </Badge>
//                                             </div>
//                                             <Clock className="w-8 h-8 text-muted-foreground opacity-50" />
//                                         </div>
//                                     </Card>
//                                 </div>
//                             )}

//                             {/* Suspension Warning */}
//                             {summary?.isSuspended && summary?.suspensionReason && (
//                                 <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
//                                     <div className="flex items-start gap-3">
//                                         <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//                                         <div>
//                                             <p className="font-semibold text-red-800 dark:text-red-400">Account Suspended</p>
//                                             <p className="text-sm text-red-700 dark:text-red-300">{summary.suspensionReason}</p>
//                                         </div>
//                                     </div>
//                                 </Card>
//                             )}

//                             {/* Strikes Table */}
//                             <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//                                 <div className="p-4 border-b border-border">
//                                     <h3 className="font-semibold">Strike History</h3>
//                                 </div>
//                                 {strikes.length === 0 ? (
//                                     <div className="text-center py-12">
//                                         <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
//                                         <p className="text-muted-foreground">No strikes issued for this artisan</p>
//                                     </div>
//                                 ) : (
//                                     <div className="overflow-x-auto">
//                                         <table className="w-full">
//                                             <thead className="bg-muted/50 border-b border-border">
//                                                 <tr>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Reason</th>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Severity</th>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Value</th>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Issued By</th>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Issued At</th>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Expires</th>
//                                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Actions</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="divide-y divide-border">
//                                                 {strikes.map((strike: Strike) => {
//                                                     const expired = isStrikeExpired(strike.expiresAt);
//                                                     return (
//                                                         <tr key={strike.id} className={`hover:bg-muted/30 transition-colors ${expired ? "opacity-60" : ""}`}>
//                                                             <td className="px-4 py-4">
//                                                                 <p className="text-sm">{strike.reason}</p>
//                                                             </td>
//                                                             <td className="px-4 py-4">
//                                                                 {getSeverityBadge(strike.severity)}
//                                                             </td>
//                                                             <td className="px-4 py-4">
//                                                                 <span className="font-medium">{strike.value}</span>
//                                                             </td>
//                                                             <td className="px-4 py-4">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <User className="w-3 h-3 text-muted-foreground" />
//                                                                     <span className="text-sm">{strike.issuedBy}</span>
//                                                                 </div>
//                                                             </td>
//                                                             <td className="px-4 py-4">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <Calendar className="w-3 h-3 text-muted-foreground" />
//                                                                     <span className="text-sm">{new Date(strike.issuedAt).toLocaleDateString()}</span>
//                                                                 </div>
//                                                             </td>
//                                                             <td className="px-4 py-4">
//                                                                 {strike.expiresAt ? (
//                                                                     <div className="flex items-center gap-2">
//                                                                         <Clock className="w-3 h-3 text-muted-foreground" />
//                                                                         <span className="text-sm">
//                                                                             {new Date(strike.expiresAt).toLocaleDateString()}
//                                                                             {expired && " (Expired)"}
//                                                                         </span>
//                                                                     </div>
//                                                                 ) : (
//                                                                     <span className="text-sm text-muted-foreground">Permanent</span>
//                                                                 )}
//                                                             </td>
//                                                             <td className="px-4 py-4">
//                                                                 {!expired && (
//                                                                     <Button
//                                                                         variant="ghost"
//                                                                         size="sm"
//                                                                         onClick={() => {
//                                                                             setSelectedStrike(strike);
//                                                                             setIsRemoveDialogOpen(true);
//                                                                         }}
//                                                                         className="text-red-600 hover:text-red-700"
//                                                                     >
//                                                                         <Trash2 className="w-4 h-4" />
//                                                                     </Button>
//                                                                 )}
//                                                             </td>
//                                                         </tr>
//                                                     );
//                                                 })}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </Card>
//                         </>
//                     )}
//                 </>
//             )}

//             {!artisanId && !isLoading && (
//                 <Card className="p-12 text-center">
//                     <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
//                     <h3 className="text-lg font-semibold mb-2">Search for an Artisan</h3>
//                     <p className="text-muted-foreground">
//                         Enter an artisan ID or artisan code to view and manage strikes
//                     </p>
//                 </Card>
//             )}

//             {/* Add Strike Modal */}
//             <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//                 <DialogContent className="max-w-md">
//                     <DialogHeader>
//                         <DialogTitle>Issue Strike to Artisan</DialogTitle>
//                         <DialogDescription>
//                             Add a strike for policy violation or misconduct
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                         <div>
//                             <Label>Reason for Strike *</Label>
//                             <Textarea
//                                 placeholder="Describe the violation..."
//                                 value={newStrike.reason}
//                                 onChange={(e) => setNewStrike(prev => ({ ...prev, reason: e.target.value }))}
//                                 rows={3}
//                             />
//                         </div>
//                         <div>
//                             <Label>Severity *</Label>
//                             <Select
//                                 value={newStrike.severity}
//                                 onValueChange={(val) => setNewStrike(prev => ({ ...prev, severity: val as "minor" | "major" | "critical" }))}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="minor">
//                                         Minor (1 point) - Verbal warning
//                                     </SelectItem>
//                                     <SelectItem value="major">
//                                         Major (2 points) - Written warning
//                                     </SelectItem>
//                                     <SelectItem value="critical">
//                                         Critical (3 points) - Immediate suspension
//                                     </SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div>
//                             <Label>Expiration Date (Optional)</Label>
//                             <Input
//                                 type="datetime-local"
//                                 value={newStrike.expiresAt}
//                                 onChange={(e) => setNewStrike(prev => ({ ...prev, expiresAt: e.target.value }))}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">
//                                 Leave empty for permanent strike
//                             </p>
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleAddStrike}
//                             disabled={isAdding || !newStrike.reason}
//                         >
//                             {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                             Issue Strike
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Remove Strike Dialog */}
//             <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Remove Strike</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             Are you sure you want to remove this strike? This action cannot be undone.
//                             {selectedStrike && (
//                                 <div className="mt-3 p-3 bg-muted/30 rounded-lg">
//                                     <p className="text-sm font-medium">Reason: {selectedStrike.reason}</p>
//                                     <p className="text-sm text-muted-foreground mt-1">
//                                         Severity: {selectedStrike.severity} ({selectedStrike.value} point{selectedStrike.value !== 1 ? "s" : ""})
//                                     </p>
//                                 </div>
//                             )}
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleRemoveStrike} className="bg-red-600 hover:bg-red-700">
//                             {isRemoving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                             Remove Strike
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </div>
//     );
// }

// function StrikeManagementSkeleton() {
//     return (
//         <div className="space-y-4">
//             <div className="grid grid-cols-4 gap-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                     <Skeleton key={i} className="h-24" />
//                 ))}
//             </div>
//             <Skeleton className="h-64" />
//         </div>
//     );
// }