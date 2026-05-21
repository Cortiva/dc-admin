import type { SummaryData } from "../modules/category/types/service-category.types";
import StatsCard from "./StatsCard";
import { 
    FolderTree, 
    CheckCircle, 
    Tag, 
    Users, 
    Briefcase,
    AlertTriangle,
    Award,
    Star,
    Layers
} from "lucide-react";
import { StatsSkeleton } from "../modules/category/components/CategorySkeletons";

interface StatsGridProps {
    summary: SummaryData;
    isLoading?: boolean;
}

export default function StatsGrid({ summary, isLoading = false }: StatsGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                    <StatsSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-6">
            {/* Row 1: Main Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Categories"
                    value={summary.totalCategories.toLocaleString()}
                    icon={<FolderTree className="w-5 h-5" />}
                    color="primary"
                    tooltip="Total number of categories in the system"
                />
                <StatsCard
                    title="Active Categories"
                    value={summary.activeCategories.toLocaleString()}
                    subtitle={`${summary.inactiveCategories.toLocaleString()} inactive`}
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="success"
                    tooltip="Categories currently active and visible"
                />
                <StatsCard
                    title="Total Skills"
                    value={summary.totalSkills.toLocaleString()}
                    subtitle={`Avg ${summary.averageSkillsPerCategory.toLocaleString()} per category`}
                    icon={<Tag className="w-5 h-5" />}
                    color="info"
                    trend={summary.averageSkillsPerCategory > 0 ? summary.averageSkillsPerCategory : undefined}
                    tooltip="Total skills across all categories"
                />
                <StatsCard
                    title="Total Artisans"
                    value={summary.totalArtisans.toLocaleString()}
                    subtitle={`Avg ${summary.averageArtisansPerCategory.toLocaleString()} per category`}
                    icon={<Users className="w-5 h-5" />}
                    color="purple"
                    tooltip="Total artisans registered"
                />
                <StatsCard
                    title="Total Jobs"
                    value={summary.totalJobs.toLocaleString()}
                    subtitle={`Avg ${summary.averageJobsPerCategory.toLocaleString()} per category`}
                    icon={<Briefcase className="w-5 h-5" />}
                    color="orange"
                    tooltip="Total jobs posted"
                />
            </div>

            {/* Row 2: Category Health Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Categories with Children"
                    value={summary.categoriesWithChildren.toLocaleString()}
                    icon={<Layers className="w-5 h-5" />}
                    color="indigo"
                    tooltip="Categories that have subcategories"
                />
                <StatsCard
                    title="Top Level Categories"
                    value={summary.topLevelCategories.toLocaleString()}
                    icon={<FolderTree className="w-5 h-5" />}
                    color="yellow"
                    tooltip="Categories without parent categories"
                />
                <StatsCard
                    title="Categories Needing Attention"
                    value={summary.categoriesNeedingAttention.toLocaleString()}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color="red"
                    changeType={summary.categoriesNeedingAttention > 0 ? "decrease" : "neutral"}
                    tooltip="Categories with no skills or jobs"
                />
                <StatsCard
                    title="Categories Complete"
                    value={summary.categoriesWithCompleteData.toLocaleString()}
                    subtitle={`${summary.completionRate.toLocaleString()}% completion rate`}
                    icon={<Award className="w-5 h-5" />}
                    color="success"
                    changeType={summary.completionRate > 50 ? "increase" : "decrease"}
                    tooltip="Categories with skills, KYC, and active status"
                />
            </div>

            {/* Row 3: Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatsCard
                    title="Categories with No Skills"
                    value={summary.categoriesWithNoSkills.toLocaleString()}
                    icon={<Tag className="w-5 h-5" />}
                    color="orange"
                    tooltip="Categories that need skills added"
                />
                <StatsCard
                    title="Categories with No Jobs"
                    value={summary.categoriesWithNoJobs.toLocaleString()}
                    icon={<Briefcase className="w-5 h-5" />}
                    color="orange"
                    tooltip="Categories with no job postings"
                />
                {summary.mostPopularCategory && summary.mostPopularCategory.name !== "Others" && (
                    <StatsCard
                        title="Most Popular Category"
                        value={summary.mostPopularCategory.name}
                        subtitle={`${summary.mostPopularCategory.jobs.toLocaleString()} jobs, ${summary.mostPopularCategory.artisans.toLocaleString()} artisans`}
                        icon={<Star className="w-5 h-5" />}
                        color="yellow"
                        tooltip="Category with the most activity"
                    />
                )}
            </div>

            {/* Current Page Stats (optional) */}
            {/* <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Current Page Statistics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active Categories:</span>
                        <span className="font-semibold">{summary.currentPageStats.activeInCurrentPage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Inactive Categories:</span>
                        <span className="font-semibold">{summary.currentPageStats.inactiveInCurrentPage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">With Children:</span>
                        <span className="font-semibold">{summary.currentPageStats.withChildrenInCurrentPage}</span>
                    </div>
                </div>
            </div> */}
        </div>
    );
}