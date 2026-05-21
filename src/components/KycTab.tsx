import { Edit, IdCardLanyard, Plus } from "lucide-react";
import { Card } from "./ui/card";
import CustomBadge from "./CustomBadge";
import { Switch } from "./ui/switch";
import { SwitchThumb } from "@radix-ui/react-switch";
import type { KycRequirement, ServiceCategory } from "../modules/category/types/service-category.types";
import { Button } from "./ui/button";
import EmptyState from "./EmptyState";
import { useMemo, useState } from "react";
import { UpsertKycRequirement } from "../modules/category/components/UpsertKycRequirement";
import { useFetchCategoryKycRequirementsQuery, useUpdateKycRequirementsMutation } from "../modules/category/categoryApiSlice";
import { Skeleton } from "./ui/skeleton";
import { handleApiError } from "../utils/functions";

interface KYCTabProps {
    selectedCategory: ServiceCategory | null;
}

export default function KYCTab({ selectedCategory }: KYCTabProps) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [kycRequirement, setKycRequirement] = useState<KycRequirement | null>(null);
    const [mode, setMode] = useState<"create" | "update">("create");

    const [updateKycRequirement] = useUpdateKycRequirementsMutation();
    
    const {
        data: response,
        isFetching,
        refetch,
    } = useFetchCategoryKycRequirementsQuery(selectedCategory?.id);
    
    const kycRequirements = useMemo(() => {
        const list = response?.data ?? [];
        return list;
    }, [response?.data]);

    const handleEdit = (requirement: KycRequirement) => {
        setKycRequirement(requirement);
        setMode("update");
        setOpenCreateModal(true);
    };

    const handleCreate = () => {
        setKycRequirement(null);
        setMode("create");
        setOpenCreateModal(true);
    };

    const handleSuccess = () => {
        setOpenCreateModal(false);
        refetch();
    };

    const onUpdateStatus = async (requirementId: string, isRequired: boolean) => {
        try {
            const data = {
                isRequired
            };

            await updateKycRequirement({ requirementId, data }).unwrap();
                
            handleSuccess();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isFetching) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-9 w-36 rounded-lg" />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card
                            key={i}
                            className="bg-card rounded-xl border border-muted-card p-5 space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                    {/* Title + badges */}
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-4 w-16 rounded-full" />
                                    </div>

                                    {/* Type */}
                                    <Skeleton className="h-4 w-52" />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-5 w-9 rounded-full" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {
                kycRequirements.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">KYC Requirements</h3>
                                <p className="text-sm text-muted-foreground mt-1">Manage verification requirements for artisans in this category</p>
                            </div>
                            <Button
                                variant="outline" size="sm"
                                className="flex items-center gap-2"
                                onClick={handleCreate}
                            >
                                <Plus className="w-4 h-4" />
                                Add Requirement
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {kycRequirements.map((req: KycRequirement, i: number) => (
                                <Card key={i} className="bg-card rounded-xl shadow-xs px-5 py-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold">{req.requirementName}</h4>
                                                {req.isRequired && (
                                                    <CustomBadge variant="danger" size="xs">Required</CustomBadge>
                                                )}
                                                {!req.isActive && (
                                                    <CustomBadge variant="secondary" size="xs">Inactive</CustomBadge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {req.description}
                                            </p>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                Type: {req.requirementType.replace("_", " ").toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 hover:bg-background rounded-lg cursor-pointer"
                                                onClick={() => handleEdit(req)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <Switch
                                                className="w-9 h-5 bg-muted-foreground rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer"
                                                defaultChecked={req.isActive}
                                                onCheckedChange={(checked) => onUpdateStatus(req.id, checked)}
                                            >
                                                <SwitchThumb
                                                    className="block w-4 h-4 bg-muted-foreground rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-4.5" />
                                            </Switch>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={<IdCardLanyard className="w-10 h-10 text-primary" />}
                        title={`No KYC Requirements for ${selectedCategory?.name}`}
                        description="KYC requirements help verify the identity of artisans in this category. You can create specific requirements to ensure trust and safety on the platform."
                        actionLabel="Add KYC Requirement"
                        onAction={handleCreate}
                    />
                )
            }

            <UpsertKycRequirement
                categoryId={selectedCategory?.id || ""}
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                mode={mode}
                kycDocument={kycRequirement}
                onSuccess={handleSuccess}
            />
        </>
    );
}
