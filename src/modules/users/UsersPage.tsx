// "use client";

// import { useState, useMemo } from "react";
// import {
//     Users,
//     RefreshCw,
//     Download,
//     UserCheck,
//     Plus,
//     Loader,
//     UserX,
// } from "lucide-react";
// import type { ListUsersResponse, User, UserFilterParams } from "./types/user.type";
// import { useFetchUsersQuery } from "./userApiSlice";
// import AppLayout from "../../components/layouts/AppLayout";
// import PageHeader from "../../components/PageHeader";
// import { Button } from "../../components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
// import UsersTable from "./components/UsersTable";
// import StrikeManagementTab from "./components/StrikeManagement";
// import { useExportUsers } from "../../hooks/useExportUsers";
// import StatCard from "../../components/StatCard";
// import UsersTableSkeleton from "./components/UsersTableSkeleton";
// import { Skeleton } from "../../components/ui/skeleton";
// import UsersStatsSkeleton from "./components/UsersStatsSkeleton";
// import { ViewUser } from "./components/ViewUser";
// import CreateAdminUser from "./components/CreateAdmin";

// export default function UsersPage() {
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [selectedUser, setSelectedUser] = useState<User | null>(null);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//     const [filters, setFilters] = useState<UserFilterParams>({
//         page: 1,
//         limit: 10,
//         sortBy: "createdAt",
//         sortOrder: "desc",
//     });
    
//     const { exportUsers, isLoading: isExporting } = useExportUsers();

//     const { data: response, isFetching, refetch } = useFetchUsersQuery(filters);

//     const users = useMemo(() => {
//         return response?.data?.users || [];
//     }, [response?.data?.users]);

//     const summary = useMemo(() => {
//         const result: ListUsersResponse = response?.data
//             return result?.summary || {
//             totalUsers: 0,
//             totalArtisans: 0,
//             totalCustomers: 0,
//             totalAdmins: 0,
//             suspendedUsers: 0,
//             activeUsers: 0,
//             inactiveUsers: 0,
//             verifiedEmails: 0,
//             verifiedPhones: 0,
//             verifiedArtisans: 0,
//             pendingArtisans: 0,
//             suspendedArtisans: 0,
//             totalWalletBalance: 0,
//             totalBonusBalance: 0,
//             totalJobsCreated: 0,
//             usersWithRecentLogin: 0,
//             newUsersThisMonth: 0,
//             completionRate: 0
//         };
//     }, [response?.data]);

//     const totalUsers = summary.totalUsers || 0;

//     const activeRate = totalUsers
//         ? Math.round((summary.activeUsers / totalUsers) * 100)
//         : 0;

//     const artisanRate = totalUsers
//         ? Math.round((summary.totalArtisans / totalUsers) * 100)
//         : 0;

//     // const verifiedRate = totalUsers
//     //     ? Math.round((summary.verifiedEmails / totalUsers) * 100)
//     //     : 0;

//     const suspensionRate = totalUsers
//         ? Math.round((summary.suspendedUsers / totalUsers) * 100)
//         : 0;

//     const pagination = useMemo(() => {
//         return response?.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
//     }, [response?.data?.pagination]);

//     const handleSearch = (searchTerm: string) => {
//         setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
//     };

//     const handleRoleFilter = (role: string) => {
//         setFilters(prev => ({ ...prev, role: role as unknown as UserFilterParams['role'], page: 1 }));
//     };

//     const handleStatusFilter = (status: string) => {
//         setFilters(prev => ({ ...prev, status, page: 1 }));
//     };

//     const handlePageChange = (page: number) => {
//         setFilters(prev => ({ ...prev, page }));
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handleLimitChange = (limit: number) => {
//         setFilters(prev => ({ ...prev, limit, page: 1 }));
//     };

//     const handleViewUser = (user: User) => {
//         setSelectedUser(user);
//         setIsDetailModalOpen(true);
//     };

//     const handleExport = async () => {
//         await exportUsers({
//             search: filters.search || undefined,
//             sortOrder: "asc",
//         });
//     };

//     const handleSuccess = () => {
//         setIsAddModalOpen(false);
//         setIsDetailModalOpen(false);
//         refetch();
//     };

//     if (isFetching) {
//         return (
//             <AppLayout>
//                 <div className="space-y-6">
//                     {/* Header Skeleton */}
//                     <div className="flex items-center justify-between">
//                         <div className="space-y-2">
//                             <div className="flex items-center gap-2">
//                                 <Skeleton className="h-8 w-8" />
//                                 <Skeleton className="h-8 w-64" />
//                             </div>
//                             <Skeleton className="h-4 w-96" />
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <Skeleton className="h-10 w-10" />
//                             <Skeleton className="h-10 w-10" />
//                             <Skeleton className="h-10 w-32" />
//                         </div>
//                     </div>

//                     {/* Stats */}
//                     <UsersStatsSkeleton />

//                     {/* Tabs */}
//                     <div className="space-y-4">
//                         <div className="flex gap-4">
//                             <Skeleton className="h-8 w-24" />
//                             <Skeleton className="h-8 w-32" />
//                         </div>

//                         {/* Table */}
//                         <UsersTableSkeleton />
//                     </div>
//                 </div>
//             </AppLayout>
//         );
//     }

//     return (
//         <AppLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                     <PageHeader
//                         icon={<Users />}
//                         title="User Management"
//                         subtitle="Manage platform users, artisans, and administrators"
//                     />
//                     <div className="flex items-center gap-3">
//                         <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//                             <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
//                         </Button>
//                         <Button
//                             variant="outline"
//                             onClick={handleExport}
//                             disabled={isExporting}
//                             className="flex items-center gap-2"
//                         >
//                             {isExporting ? <Loader className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
//                         </Button>
//                         <Button onClick={() => setIsAddModalOpen(true)}>
//                             <Plus className="w-4 h-4" />
//                             Add Admin
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//                     <StatCard
//                         title="Total Users"
//                         value={totalUsers.toLocaleString()}
//                         icon={<Users className="w-5 h-5" />}
//                         color="blue"
//                         trend={{ value: `${summary.newUsersThisMonth} new this month`, positive: true }}
//                     />

//                     <StatCard
//                         title="Active Users"
//                         value={summary.activeUsers.toLocaleString()}
//                         icon={<UserCheck className="w-5 h-5" />}
//                         color="green"
//                         trend={{ value: `${activeRate}% active`, positive: true }}
//                     />

//                     <StatCard
//                         title="Artisans"
//                         value={summary.totalArtisans.toLocaleString()}
//                         icon={<UserCheck className="w-5 h-5" />}
//                         color="yellow"
//                         trend={{ value: `${artisanRate}% of users`, positive: true }}
//                     />

//                     <StatCard
//                         title="Suspended Users"
//                         value={summary.suspendedUsers.toLocaleString()}
//                         icon={<UserX className="w-5 h-5" />}
//                         color="red"
//                         trend={{
//                             value: `${suspensionRate}% suspended`,
//                             positive: summary.suspendedUsers === 0,
//                         }}
//                     />
//                 </div>

//                 {/* Main Tabs */}
//                 <Tabs defaultValue="users" className="space-y-6">
//                     <TabsList className="flex items-center mb-5">
//                         <TabsTrigger
//                             value="users"
//                             className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
//                         >
//                             All Users
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="strikes"
//                             className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
//                         >
//                             Strike Management
//                         </TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="users">
//                         <UsersTable
//                             users={users}
//                             pagination={pagination}
//                             isFetching={isFetching}
//                             filters={filters}
//                             onSearch={handleSearch}
//                             onRoleFilter={handleRoleFilter}
//                             onStatusFilter={handleStatusFilter}
//                             onPageChange={handlePageChange}
//                             onLimitChange={handleLimitChange}
//                             onViewUser={handleViewUser}
//                             onSuccess={handleSuccess}
//                         />
//                     </TabsContent>

//                     {/* <TabsContent value="verification">
//                         <VerificationQueueTab />
//                     </TabsContent> */}

//                     <TabsContent value="strikes">
//                         <StrikeManagementTab />
//                     </TabsContent>

//                     {/* <TabsContent value="blacklist">
//                         <BlacklistTab />
//                     </TabsContent>

//                     <TabsContent value="audit">
//                         <AuditLogsTab />
//                     </TabsContent> */}
//                 </Tabs>

//                 <ViewUser
//                     isOpen={isDetailModalOpen}
//                     onClose={() => {
//                         setIsDetailModalOpen(false);
//                         setSelectedUser(null);
//                     }}
//                     user={selectedUser}
//                     onSuccess={handleSuccess}
//                 />

//                 <CreateAdminUser
//                     isOpen={isAddModalOpen}
//                     onClose={() => {
//                         setIsAddModalOpen(false);
//                     }}
//                     onSuccess={handleSuccess}
//                 />

//             </div>
//         </AppLayout>
//     );
// }