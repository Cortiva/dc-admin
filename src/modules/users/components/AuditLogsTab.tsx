// "use client";

// import { useState, useMemo } from "react";
// import {
//     FileText,
//     RefreshCw,
//     Calendar,
//     User,
//     Activity,
//     ChevronLeft,
//     ChevronRight,
//     ChevronsLeft,
//     ChevronsRight,
//     Eye,
//     Edit,
//     Trash2,
//     UserCheck,
//     UserX,
//     Ban,
//     Flag,
// } from "lucide-react";
// import type { AuditLog, AuditLogFilterParams } from "../types/user.type";
// import { useFetchAuditLogsQuery } from "../userApiSlice";
// import { Badge } from "../../../components/ui/badge";
// import { Card } from "../../../components/ui/card";
// import { Input } from "../../../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
// import { Button } from "../../../components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
// import { Skeleton } from "../../../components/ui/skeleton";

// export default function AuditLogsTab() {
//     const [filters, setFilters] = useState<AuditLogFilterParams>({
//         page: 1,
//         limit: 10,
//     });
//     const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//     const { data: response, isLoading, refetch } = useFetchAuditLogsQuery(filters);

//     const logs = useMemo(() => response?.data?.logs || [], [response?.data?.logs]);
//     const pagination = useMemo(() => response?.data?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 }, [response?.data?.pagination]);

//     const handleSearch = (search: string) => {
//         setFilters(prev => ({ ...prev, userId: search, page: 1 }));
//     };

//     const handleActionFilter = (action: string) => {
//         setFilters(prev => ({ ...prev, action: action || undefined, page: 1 }));
//     };

//     const handleEntityFilter = (entityType: string) => {
//         setFilters(prev => ({ ...prev, entityType: entityType || undefined, page: 1 }));
//     };

//     const handleDateRange = (fromDate: string, toDate: string) => {
//         setFilters(prev => ({ ...prev, fromDate, toDate, page: 1 }));
//     };

//     const handlePageChange = (page: number) => {
//         setFilters(prev => ({ ...prev, page }));
//     };

//     const handleLimitChange = (limit: number) => {
//         setFilters(prev => ({ ...prev, limit, page: 1 }));
//     };

//     const getActionIcon = (action: string) => {
//         if (action.includes("CREATE") || action.includes("ADD")) return <Plus className="w-4 h-4 text-green-500" />;
//         if (action.includes("UPDATE") || action.includes("EDIT")) return <Edit className="w-4 h-4 text-blue-500" />;
//         if (action.includes("DELETE") || action.includes("REMOVE")) return <Trash2 className="w-4 h-4 text-red-500" />;
//         if (action.includes("VERIFY")) return <UserCheck className="w-4 h-4 text-green-500" />;
//         if (action.includes("SUSPEND")) return <UserX className="w-4 h-4 text-yellow-500" />;
//         if (action.includes("BLACKLIST")) return <Ban className="w-4 h-4 text-red-500" />;
//         if (action.includes("STRIKE")) return <Flag className="w-4 h-4 text-orange-500" />;
//         return <Activity className="w-4 h-4 text-muted-foreground" />;
//     };

//     const getActionBadge = (action: string) => {
//         if (action.includes("CREATE")) return <Badge className="bg-green-300/20 text-green-700">Create</Badge>;
//         if (action.includes("UPDATE")) return <Badge className="bg-blue-300/20 text-blue-700">Update</Badge>;
//         if (action.includes("DELETE")) return <Badge className="bg-red-300/20 text-red-700">Delete</Badge>;
//         if (action.includes("VERIFY")) return <Badge className="bg-green-300/20 text-green-700">Verify</Badge>;
//         if (action.includes("SUSPEND")) return <Badge className="bg-yellow-300/20 text-yellow-700">Suspend</Badge>;
//         if (action.includes("BLACKLIST")) return <Badge className="bg-red-300/20 text-red-700">Blacklist</Badge>;
//         if (action.includes("STRIKE")) return <Badge className="bg-orange-300/20 text-orange-700">Strike</Badge>;
//         return <Badge variant="secondary">{action}</Badge>;
//     };

//     const formatChangeValue = (value: unknown): string => {
//         try {
//             if (typeof value === "string") return value;

//             return JSON.stringify(value, null, 2);
//         } catch {
//             return String(value);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Filters Bar */}
//             <Card className="p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                         <Label>Search by User ID</Label>
//                         <Input
//                             placeholder="User ID..."
//                             value={filters.userId || ""}
//                             onChange={(e) => handleSearch(e.target.value)}
//                             className="mt-1"
//                         />
//                     </div>
//                     <div>
//                         <Label>Action Type</Label>
//                         <Select value={filters.action || "all"} onValueChange={handleActionFilter}>
//                             <SelectTrigger className="mt-1">
//                                 <SelectValue placeholder="All Actions" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">All Actions</SelectItem>
//                                 <SelectItem value="USER_CREATED">User Created</SelectItem>
//                                 <SelectItem value="USER_UPDATED">User Updated</SelectItem>
//                                 <SelectItem value="USER_DELETED">User Deleted</SelectItem>
//                                 <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
//                                 <SelectItem value="USER_ACTIVATED">User Activated</SelectItem>
//                                 <SelectItem value="ARTISAN_VERIFIED">Artisan Verified</SelectItem>
//                                 <SelectItem value="ARTISAN_REJECTED">Artisan Rejected</SelectItem>
//                                 <SelectItem value="STRIKE_ADDED">Strike Added</SelectItem>
//                                 <SelectItem value="STRIKE_REMOVED">Strike Removed</SelectItem>
//                                 <SelectItem value="USER_BLACKLISTED">User Blacklisted</SelectItem>
//                                 <SelectItem value="USER_UNBLACKLISTED">User Unblacklisted</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label>Entity Type</Label>
//                         <Select value={filters.entityType || "all"} onValueChange={handleEntityFilter}>
//                             <SelectTrigger className="mt-1">
//                                 <SelectValue placeholder="All Entities" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">All Entities</SelectItem>
//                                 <SelectItem value="User">User</SelectItem>
//                                 <SelectItem value="Artisan">Artisan</SelectItem>
//                                 <SelectItem value="Strike">Strike</SelectItem>
//                                 <SelectItem value="Blacklist">Blacklist</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label>Date Range</Label>
//                         <div className="flex gap-2 mt-1">
//                             <Input
//                                 type="date"
//                                 value={filters.fromDate?.split("T")[0] || ""}
//                                 onChange={(e) => handleDateRange(e.target.value, filters.toDate || "")}
//                                 placeholder="From"
//                             />
//                             <Input
//                                 type="date"
//                                 value={filters.toDate?.split("T")[0] || ""}
//                                 onChange={(e) => handleDateRange(filters.fromDate || "", e.target.value)}
//                                 placeholder="To"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex justify-end mt-4">
//                     <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
//                         <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//                         Refresh
//                     </Button>
//                 </div>
//             </Card>

//             {/* Audit Logs Table */}
//             {isLoading ? (
//                 <AuditLogsSkeleton />
//             ) : logs.length === 0 ? (
//                 <Card className="p-12 text-center">
//                     <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
//                     <h3 className="text-lg font-semibold mb-2">No Audit Logs Found</h3>
//                     <p className="text-muted-foreground">
//                         Try adjusting your filters or search criteria
//                     </p>
//                 </Card>
//             ) : (
//                 <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-muted/50 border-b border-border">
//                                 <tr>
//                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Action</th>
//                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Entity</th>
//                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">User</th>
//                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">IP Address</th>
//                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Timestamp</th>
//                                     <th className="text-left px-4 py-3 text-xs font-medium uppercase">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-border">
//                                 {logs.map((log: AuditLog) => (
//                                     <tr key={log.id} className="hover:bg-muted/30 transition-colors">
//                                         <td className="px-4 py-4">
//                                             <div className="flex items-center gap-2">
//                                                 {getActionIcon(log.action)}
//                                                 {getActionBadge(log.action)}
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div>
//                                                 <p className="text-sm font-medium">{log.entityType}</p>
//                                                 <p className="text-xs text-muted-foreground font-mono">{log.entityId}</p>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div className="flex items-center gap-2">
//                                                 <User className="w-3 h-3 text-muted-foreground" />
//                                                 <div>
//                                                     <p className="text-sm">{log.user.firstName} {log.user.lastName}</p>
//                                                     <p className="text-xs text-muted-foreground">{log.user.email}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <code className="text-xs">{log.ipAddress}</code>
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div className="flex items-center gap-2">
//                                                 <Calendar className="w-3 h-3 text-muted-foreground" />
//                                                 <span className="text-sm">
//                                                     {new Date(log.createdAt).toLocaleString()}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() => {
//                                                     setSelectedLog(log);
//                                                     setIsDetailModalOpen(true);
//                                                 }}
//                                             >
//                                                 <Eye className="w-4 h-4" />
//                                             </Button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     {pagination.totalPages > 0 && (
//                         <div className="px-4 py-3 border-t border-border flex items-center justify-between">
//                             <p className="text-sm text-muted-foreground">
//                                 Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
//                             </p>
//                             <div className="flex items-center gap-2">
//                                 <div className="flex items-center gap-1">
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => handlePageChange(1)}
//                                         disabled={pagination.page === 1}
//                                     >
//                                         <ChevronsLeft className="w-4 h-4" />
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => handlePageChange(pagination.page - 1)}
//                                         disabled={pagination.page === 1}
//                                     >
//                                         <ChevronLeft className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                                 <span className="text-sm px-2">
//                                     Page {pagination.page} of {pagination.totalPages}
//                                 </span>
//                                 <div className="flex items-center gap-1">
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => handlePageChange(pagination.page + 1)}
//                                         disabled={pagination.page === pagination.totalPages}
//                                     >
//                                         <ChevronRight className="w-4 h-4" />
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => handlePageChange(pagination.totalPages)}
//                                         disabled={pagination.page === pagination.totalPages}
//                                     >
//                                         <ChevronsRight className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                                 <Select value={String(pagination.limit)} onValueChange={(val) => handleLimitChange(Number(val))}>
//                                     <SelectTrigger className="w-25 ml-2">
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="25">25 / page</SelectItem>
//                                         <SelectItem value="50">50 / page</SelectItem>
//                                         <SelectItem value="100">100 / page</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                     )}
//                 </Card>
//             )}

//             {/* Detail Modal */}
//             <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
//                 <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                     <DialogHeader>
//                         <DialogTitle>Audit Log Details</DialogTitle>
//                     </DialogHeader>
                    
//                     {selectedLog && (
//                         <div className="space-y-6">
//                             {/* Top Summary Card */}
//                             <div className="p-5 rounded-xl border bg-card shadow-sm">
//                                 <div className="flex flex-wrap justify-between gap-4">
//                                     {/* Action */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 rounded-lg bg-primary/10">
//                                             {getActionIcon(selectedLog.action)}
//                                         </div>
//                                         <div>
//                                             <p className="text-xs text-muted-foreground">Action</p>
//                                             <p className="font-semibold capitalize">{selectedLog.action}</p>
//                                         </div>
//                                     </div>

//                                     {/* Timestamp */}
//                                     <div>
//                                         <p className="text-xs text-muted-foreground">Timestamp</p>
//                                         <p className="font-medium">
//                                             {new Date(selectedLog.createdAt).toLocaleString()}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Entity */}
//                                 <div className="p-4 rounded-xl border bg-muted/30">
//                                     <p className="text-xs text-muted-foreground mb-1">Entity</p>
//                                     <p className="font-medium">{selectedLog.entityType}</p>
//                                     <p className="text-xs font-mono text-muted-foreground break-all">
//                                         {selectedLog.entityId}
//                                     </p>
//                                 </div>

//                                 {/* User */}
//                                 <div className="p-4 rounded-xl border bg-muted/30">
//                                     <p className="text-xs text-muted-foreground mb-1">Performed By</p>
//                                     <p className="font-medium">
//                                         {selectedLog.user.firstName} {selectedLog.user.lastName}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">
//                                         {selectedLog.user.email}
//                                     </p>
//                                 </div>

//                                 {/* IP */}
//                                 <div className="p-4 rounded-xl border bg-muted/30">
//                                     <p className="text-xs text-muted-foreground mb-1">IP Address</p>
//                                     <code className="text-sm bg-background px-2 py-1 rounded">
//                                         {selectedLog.ipAddress}
//                                     </code>
//                                 </div>

//                                 {/* User Agent */}
//                                 <div className="p-4 rounded-xl border bg-muted/30">
//                                     <p className="text-xs text-muted-foreground mb-1">User Agent</p>
//                                     <p className="text-xs break-all line-clamp-3">
//                                         {selectedLog.userAgent}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Changes Section */}
//                             {(selectedLog.oldValue || selectedLog.newValue) && (
//                                 <div className="space-y-4">
//                                     <h4 className="font-semibold text-base">Changes</h4>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {/* Old Value */}
//                                         {selectedLog.oldValue && (
//                                             <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
//                                                 <div className="px-4 py-2 border-b border-red-200 dark:border-red-900">
//                                                     <p className="text-sm font-medium text-red-700 dark:text-red-400">
//                                                         Previous
//                                                     </p>
//                                                 </div>
//                                                 <pre className="p-4 text-xs overflow-x-auto max-h-64">
//                                                     {formatChangeValue(selectedLog.oldValue)}
//                                                 </pre>
//                                             </div>
//                                         )}

//                                         {/* New Value */}
//                                         {selectedLog.newValue && (
//                                             <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
//                                                 <div className="px-4 py-2 border-b border-green-200 dark:border-green-900">
//                                                     <p className="text-sm font-medium text-green-700 dark:text-green-400">
//                                                         Updated
//                                                     </p>
//                                                 </div>
//                                                 <pre className="p-4 text-xs overflow-x-auto max-h-64">
//                                                     {formatChangeValue(selectedLog.newValue)}
//                                                 </pre>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }

// function AuditLogsSkeleton() {
//     return (
//         <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
//             <div className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead className="bg-muted/50">
//                         <tr>
//                             {Array.from({ length: 6 }).map((_, i) => (
//                                 <th key={i} className="px-4 py-3">
//                                     <Skeleton className="h-4 w-24" />
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {Array.from({ length: 10 }).map((_, i) => (
//                             <tr key={i} className="border-b border-border">
//                                 {Array.from({ length: 6 }).map((_, j) => (
//                                     <td key={j} className="px-4 py-3">
//                                         <Skeleton className="h-6 w-full" />
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </Card>
//     );
// }

// // Helper component for Label (if not already imported)
// function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
//     return (
//         <label className={`text-sm font-medium ${className || ""}`} {...props}>
//             {children}
//         </label>
//     );
// }

// // Helper component for Plus icon (if missing)
// function Plus(props: React.SVGProps<SVGSVGElement>) {
//     return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
// }