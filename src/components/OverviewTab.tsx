import { Briefcase, Edit, Shield, Users } from "lucide-react";
import CustomBadge from "./CustomBadge";
import { Card } from "./ui/card";
import InfoRow from "./helper/InfoRow";
import QuickStat from "./helper/QuickStat";
import { Button } from "./ui/button";
import type { ServiceCategory } from "../modules/category/types/service-category.types";

interface OverviewTabProps {
    selectedCategory: ServiceCategory;
    onEdit?: (c: ServiceCategory) => void;
};

export default function OverviewTab({ selectedCategory, onEdit }: OverviewTabProps) {
    return (
        <>
            <div className="space-y-6">
                {/* Category Header */}
                <Card className="bg-card rounded-xl shadow-sm overflow-hidden">
                    <div className="relative h-18.75 bg-background">
                        <div className="absolute -bottom-8 left-6">
                            <div className="w-20 h-20 bg-accent rounded-2xl shadow-lg flex items-center justify-center text-4xl">
                                {selectedCategory?.icon}
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-6 flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => onEdit?.(selectedCategory)}>
                                    <Edit className="w-4 h-4 mr-1" /> Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-10 px-6 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex flex-row items-center gap-3">
                                    <h2 className="text-2xl font-bold">
                                        {selectedCategory?.name}
                                    </h2>

                                    <CustomBadge variant={selectedCategory?.isActive ? "success" : "secondary"} size="sm">
                                        {selectedCategory?.isActive ? "Active" : "Inactive"}
                                    </CustomBadge>
                                </div>
                                <p className="text-muted-foreground mt-1">{selectedCategory?.description}</p>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-background">
                            <QuickStat
                                label="Jobs"
                                value={selectedCategory?._count?.jobs.toLocaleString() || "0"}
                                icon={<Briefcase className="w-4 h-4" />}
                            />
                            <QuickStat
                                label="Artisans"
                                value={selectedCategory?._count?.artisans.toLocaleString() || "0"}
                                icon={<Users className="w-4 h-4" />}
                            />
                            <QuickStat
                                label="Skills"
                                value={selectedCategory?._count?.skills.toLocaleString() || "0"}
                                icon={<Users className="w-4 h-4" />}
                            />
                            <QuickStat
                                label="KYC Requirements"
                                value={selectedCategory?._count?.kycRequirements.toLocaleString() || "0"}
                                icon={<Shield className="w-4 h-4" />}
                            />
                            <QuickStat
                                label="Price Templates"
                                value={selectedCategory?._count?.priceTemplates.toLocaleString() || "0"}
                                icon={<Shield className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                </Card>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subcategories List */}
                    <Card className="bg-card rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Subcategories</h3>
                        </div>
                        <div className="space-y-3">
                            {selectedCategory?.children?.map((sub, index) => (
                                <div key={index}
                                    className="flex items-center justify-between py-2 border-b border-background last:border-0">
                                    <div>
                                        <p className="font-medium">{sub.name}</p>
                                        <p className="text-muted-foreground">{ sub.description || "No description available." }</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-muted-foreground">{sub.skills.length || 0} Skills</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CustomBadge variant={sub.isActive ? "success" : "secondary"} size="sm">
                                            {sub.isActive ? "Active" : "Inactive"}
                                        </CustomBadge>
                                    </div>
                                </div>
                            ))}
                            {selectedCategory?.children?.length === 0 && (
                                <p className="text-sm text-muted-foreground">No subcategories found.</p>
                            )}
                        </div>
                    </Card>

                    {/* Metadata & Settings */}
                    <Card className="bg-card rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Category Information</h3>
                        <div className="space-y-3">
                            <InfoRow label="Category ID" value={selectedCategory?.id || "N/A"} />
                            <InfoRow label="Parent Category" value={selectedCategory?.parent?.name || "None (Top Level)"} />
                            <InfoRow label="Created" value={selectedCategory?.createdAt || "N/A"} />
                            <InfoRow label="Last Updated" value={selectedCategory?.updatedAt || "N/A"} />
                            <InfoRow label="Total Skills" value={selectedCategory?.skills.length || "0"} />
                            <InfoRow label="Default Price Template" value={selectedCategory?.priceTemplates?.[0]?.name || "N/A"} />
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
