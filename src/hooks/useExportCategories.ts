import { useCallback } from "react";
import { categoryApiSlice } from "../modules/category/categoryApiSlice";
import { toast } from "react-toastify";

export const useExportCategories = () => {
    const [exportMutation, { isLoading }] =
        categoryApiSlice.endpoints.exportCategoriesWithSummary.useMutation();

    const exportCategories = useCallback(
        async (filters?: {
            search?: string;
            parentId?: string;
            isActive?: boolean;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
        }) => {
            try {
                const csvData = await exportMutation({ ...filters }).unwrap();

                // Debug: Log the raw response
                console.log("Raw CSV Data Type:", typeof csvData);
                console.log("Raw CSV Data:", csvData);

                if (typeof csvData === "object") {
                    console.log(
                        "Response is an object:",
                        JSON.stringify(csvData, null, 2),
                    );
                }

                if (!csvData || typeof csvData !== "string") {
                    throw new Error("Invalid CSV data received");
                }

                if (csvData.trim().length === 0) {
                    throw new Error("Empty CSV data received");
                }

                // Add BOM for UTF-8 to support special characters
                const blob = new Blob(["\uFEFF" + csvData], {
                    type: "text/csv;charset=utf-8;",
                });

                // Generate filename with timestamp
                const timestamp = new Date()
                    .toISOString()
                    .replace(/[:.]/g, "-")
                    .slice(0, -5);
                const filename = `categories_export_${timestamp}.csv`;

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();

                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success("Categories exported successfully");
                return true;
            } catch (error) {
                console.error("Export failed:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to export categories";
                toast.error(errorMessage);
                return false;
            }
        },
        [exportMutation],
    );

    return {
        exportCategories,
        isLoading,
    };
};
