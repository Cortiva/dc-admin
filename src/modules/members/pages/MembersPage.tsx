"use client";

import { useState, useMemo } from "react";
import {
    Users,
    RefreshCw,
    Download,
    UserCheck,
    Plus,
    UserX,
    Calendar,
} from "lucide-react";
import type { Member, MemberFilterParams } from "../../../types/member.type";
import { membersData } from "../../../mock/members";
import { Skeleton } from "../../../components/ui/skeleton";
import MembersStatsSkeleton from "../components/MembersStatsSkeleton";
import MembersTableSkeleton from "../components/MembersTableSkeleton";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import StatCard from "../../../components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import MembersTable from "../components/MembersTable";
import { ViewMember } from "../components/ViewMember";
import CreateMember from "../components/CreateMember";

export default function MembersPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [filters, setFilters] = useState<MemberFilterParams>({
        page: 1,
        limit: 10,
        sortBy: "fullName",
        sortOrder: "asc",
        search: "",
        zone: "",
        department: "",
        attendedDcaBasic: undefined,
    });

    // Simulate API fetch with delay
    const fetchMembers = async () => {
        setIsFetching(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsFetching(false);
    };

    const handleRefetch = () => {
        fetchMembers();
    };

    // Filter and paginate members
    const filteredMembers = useMemo(() => {
        let result = [...membersData];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(member =>
                member.fullName.toLowerCase().includes(searchLower) ||
                member.phoneNumber.includes(filters.search!) ||
                member.address.toLowerCase().includes(searchLower)
            );
        }

        // Apply zone filter
        if (filters.zone) {
            result = result.filter(member => member.zone === filters.zone);
        }

        // Apply department filter
        if (filters.department) {
            result = result.filter(member => member.department === filters.department);
        }

        // Apply training filters
        if (filters.attendedDcaBasic !== undefined) {
            result = result.filter(member => member.attendedDcaBasic === filters.attendedDcaBasic);
        }

        // Apply sorting
        result.sort((a, b) => {
            const aVal = a[filters.sortBy as keyof Member];
            const bVal = b[filters.sortBy as keyof Member];
            if (aVal! < bVal!) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aVal! > bVal!) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [filters]);

    // Pagination
    const paginatedMembers = useMemo(() => {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        return filteredMembers.slice(start, end);
    }, [filteredMembers, filters.page, filters.limit]);

    const pagination = useMemo(() => ({
        page: filters.page,
        limit: filters.limit,
        total: filteredMembers.length,
        totalPages: Math.ceil(filteredMembers.length / filters.limit)
    }), [filteredMembers.length, filters.page, filters.limit]);

    // Statistics
    const summary = useMemo(() => {
        const totalMembers = membersData.length;
        const activeMembers = membersData.filter(m => m.attendedDcaBasic || m.attendedDcaMaturity).length;
        const completedTraining = membersData.filter(m => m.attendedDli).length;
        const marriedMembers = membersData.filter(m => m.maritalStatus === "Married").length;
        const maleMembers = membersData.filter(m => m.gender === "Male").length;
        const femaleMembers = membersData.filter(m => m.gender === "Female").length;

        return {
            totalMembers,
            activeMembers,
            completedTraining,
            marriedMembers,
            maleMembers,
            femaleMembers,
            departments: [...new Set(membersData.map(m => m.department))].length,
            zones: [...new Set(membersData.map(m => m.zone))].length,
        };
    }, []);

    const activeRate = summary.totalMembers
        ? Math.round((summary.activeMembers / summary.totalMembers) * 100)
        : 0;

    const trainingRate = summary.totalMembers
        ? Math.round((summary.completedTraining / summary.totalMembers) * 100)
        : 0;

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleZoneFilter = (zone: string) => {
        setFilters(prev => ({ ...prev, zone, page: 1 }));
    };

    const handleDepartmentFilter = (department: string) => {
        setFilters(prev => ({ ...prev, department, page: 1 }));
    };

    // const handleTrainingFilter = (training: 'basic' | 'maturity' | 'dli') => {
    //     setFilters(prev => ({ ...prev, attendedDcaBasic: true, page: 1 }));
    // };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({ ...prev, limit, page: 1 }));
    };

    const handleViewMember = (member: Member) => {
        setSelectedMember(member);
        setIsDetailModalOpen(true);
    };

    const handleExport = async () => {
        // Implement export functionality
        console.log("Exporting members...");
    };

    const handleSuccess = () => {
        setIsAddModalOpen(false);
        setIsDetailModalOpen(false);
        handleRefetch();
    };

    if (isFetching) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-64" />
                        </div>
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <MembersStatsSkeleton />
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <MembersTableSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    icon={<Users />}
                    title="Church Members"
                    subtitle="Manage church members, track attendance, and view member profiles"
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefetch} disabled={isFetching}>
                        <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Members"
                    value={summary.totalMembers.toLocaleString()}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                    trend={{ value: `${summary.zones} zones represented`, positive: true }}
                />

                <StatCard
                    title="Active Members"
                    value={summary.activeMembers.toLocaleString()}
                    icon={<UserCheck className="w-5 h-5" />}
                    color="green"
                    trend={{ value: `${activeRate}% active`, positive: true }}
                />

                <StatCard
                    title="Completed DLI"
                    value={summary.completedTraining.toLocaleString()}
                    icon={<Calendar className="w-5 h-5" />}
                    color="yellow"
                    trend={{ value: `${trainingRate}% completed`, positive: true }}
                />

                <StatCard
                    title="Married Members"
                    value={summary.marriedMembers.toLocaleString()}
                    icon={<UserX className="w-5 h-5" />}
                    color="purple"
                    trend={{ value: `${Math.round((summary.marriedMembers / summary.totalMembers) * 100)}%`, positive: true }}
                />
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="flex items-center mb-5">
                    <TabsTrigger
                        value="members"
                        className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                    >
                        All Members
                    </TabsTrigger>
                    <TabsTrigger
                        value="training"
                        className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                    >
                        Training Progress
                    </TabsTrigger>
                    <TabsTrigger
                        value="departments"
                        className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                    >
                        By Department
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                    <MembersTable
                        members={paginatedMembers}
                        pagination={pagination}
                        isFetching={isFetching}
                        filters={filters}
                        onSearch={handleSearch}
                        onZoneFilter={handleZoneFilter}
                        onDepartmentFilter={handleDepartmentFilter}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                        onViewMember={handleViewMember}
                        onSuccess={handleSuccess}
                    />
                </TabsContent>

                <TabsContent value="training">
                    {/* Training Progress Tab Content */}
                    <TrainingProgressTab members={membersData} />
                </TabsContent>

                <TabsContent value="departments">
                    {/* Departments Tab Content */}
                    <DepartmentsTab members={membersData} />
                </TabsContent>
            </Tabs>

            <ViewMember
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedMember(null);
                }}
                member={selectedMember}
            />

            <CreateMember
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}

// Additional components for tabs
function TrainingProgressTab({ members }: { members: Member[] }) {
    const basicAttendees = members.filter(m => m.attendedDcaBasic).length;
    const maturityAttendees = members.filter(m => m.attendedDcaMaturity).length;
    const dliAttendees = members.filter(m => m.attendedDli).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
                <h3 className="text-lg font-semibold mb-2">DCA Basic</h3>
                <p className="text-3xl font-bold text-green-600">{basicAttendees}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((basicAttendees / members.length) * 100)}% of total members
                </p>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
                <h3 className="text-lg font-semibold mb-2">DCA Maturity</h3>
                <p className="text-3xl font-bold text-blue-600">{maturityAttendees}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((maturityAttendees / members.length) * 100)}% of total members
                </p>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
                <h3 className="text-lg font-semibold mb-2">DLI</h3>
                <p className="text-3xl font-bold text-purple-600">{dliAttendees}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((dliAttendees / members.length) * 100)}% of total members
                </p>
            </div>
        </div>
    );
}

function DepartmentsTab({ members }: { members: Member[] }) {
    const departmentCounts = members.reduce((acc, member) => {
        acc[member.department] = (acc[member.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(departmentCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([dept, count]) => (
                    <div key={dept} className="bg-card rounded-xl shadow-sm border border-muted-card p-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{dept}</span>
                            <span className="text-2xl font-bold text-primary">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${(count / members.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {Math.round((count / members.length) * 100)}% of members
                        </p>
                    </div>
                ))}
        </div>
    );
}