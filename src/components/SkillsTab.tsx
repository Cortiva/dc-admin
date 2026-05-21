import { Card } from "./ui/card";
import { BrainCircuit, Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import CustomBadge from "./CustomBadge";
import { Skeleton } from "./ui/skeleton";
import { useMemo, useState } from "react";
import type { SkillFilterDto, ServiceCategory, Skill } from "../modules/category/types/service-category.types";
import { useFetchCategorySkillsQuery } from "../modules/category/categoryApiSlice";
import EmptyState from "./EmptyState";
import { Button } from "./ui/button";
import AppPagination from "./AppPagination";
import { UpsertSkill } from "../modules/category/components/UpsertSkill";
import type { PaginationMeta } from "../types/base.type";
import { DeleteSkill } from "../modules/category/components/DeleteSkill";

export default function SkillsTab({ selectedCategory }: { selectedCategory: ServiceCategory | null }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [skill, setSkill] = useState<Skill | null>(null);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [search, setSearch] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    
    const queryParams: SkillFilterDto = {
        categoryId: selectedCategory?.id || "",
        search: search || undefined,
        page,
        limit,
    };

    const {
        data: response,
        isFetching,
        refetch,
    } = useFetchCategorySkillsQuery(queryParams);
    
    const skills = useMemo(() => {
        const list = response?.data.skills ?? [];
        return list;
    }, [response?.data]);

    const pagination: PaginationMeta = useMemo(() => {
        return response?.data?.pagination ?? {};
    }, [response?.data?.pagination]);

    const handleEdit = (skill: Skill) => {
        setSkill(skill);
        setMode("update");
        setOpenCreateModal(true);
    };

    const handleDelete = (skill: Skill) => {
        setSkill(skill);
        setOpenDeleteModal(true);
    };
    
    const handleCreate = () => {
        setSkill(null);
        setMode("create");
        setOpenCreateModal(true);
    };

    const handleSuccess = () => {
        setOpenCreateModal(false);
        setOpenDeleteModal(false);
        refetch();
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
        refetch();
    };

    if (isFetching) {
        return (
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header */}
                        <thead className="bg-background border-b border-muted-background">
                            <tr>
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <th key={i} className="px-6 py-3">
                                        <Skeleton className="h-4 w-24" />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-muted-background">
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {/* Skill Name */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </td>

                                    {/* Default Price */}
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-24" />
                                    </td>

                                    {/* Market Range */}
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-28" />
                                    </td>

                                    {/* Artisans */}
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-16" />
                                    </td>

                                    {/* Jobs */}
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-16" />
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-6 w-6 rounded" />
                                            <Skeleton className="h-6 w-6 rounded" />
                                            <Skeleton className="h-6 w-6 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-muted-background flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <>
            {skills.length > 0 ? (
                <div className="space-y-6">
                    {/* Actions Bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text" placeholder="Search skills..."
                                    className="pl-9 pr-3 py-2 text-sm bg-background border border-muted-card rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={search || ""}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="p-2 border border-muted-card rounded-lg hover:bg-background">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                        <Button
                            variant="outline" size="sm"
                            className="flex items-center gap-2"
                            onClick={handleCreate}
                        >
                            <Plus className="w-4 h-4" />
                            Add Skill
                        </Button>
                    </div>

                    {/* Skills Table */}
                    <Card className="bg-card rounded-xl shadow-sm border border-muted-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background border-b border-muted-card">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium uppercase">Icon</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium uppercase">Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium uppercase">Description</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium uppercase">Artisans</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium uppercase">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted-card">
                                    {skills.map((skill: Skill, index: number) => (
                                        <tr key={index} className="hover:bg-muted-card transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-4xl font-medium">{skill.icon}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{skill.name}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{skill.description}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm">{skill._count?.artisanSkills.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <CustomBadge variant={skill.isActive ? "success" : "secondary"} size="sm">
                                                    {skill.isActive ? "Active" : "Inactive"}
                                                </CustomBadge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(skill)}>
                                                        <Edit className="w-4 h-4 text-primary" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(skill)}>
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <AppPagination
                            currentPage={pagination.page}
                            totalItems={pagination.total}
                            pageSize={limit}
                            onPageChange={(p) => setPage(p)}
                            onLimitChange={(l) => handleLimitChange(l)}
                        />
                    </Card>
                </div>) : (
                <EmptyState
                    icon={<BrainCircuit className="w-10 h-10 text-primary" />}
                    title={`No Skills for ${selectedCategory?.name}`}
                    description="Skills help define the capabilities of artisans in this category. You can create specific skills to ensure trust and safety on the platform."
                    actionLabel="Add Skill"
                    onAction={handleCreate}
                />
            )}
                    
            <UpsertSkill
                categoryId={selectedCategory?.id || ""}
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                mode={mode}
                skill={skill}
                onSuccess={handleSuccess}
            />
                    
            <DeleteSkill
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                skill={skill}
                onSuccess={handleSuccess}
            />
        </>
    );
}
