import { useCallback } from "react";
import { toast } from "react-toastify";
import { adminApiSlice } from "../modules/users/userApiSlice";

export const useExportUsers = () => {
    const [exportMutation, { isLoading }] =
        adminApiSlice.endpoints.exportUsers.useMutation();

    const exportUsers = useCallback(
        async (filters?: {
            search?: string;
            role?: string;
            isActive?: boolean;
            status?: string;
            emailVerified?: string;
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
                const filename = `users_export_${timestamp}.csv`;

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

                toast.success("Users exported successfully");
                return true;
            } catch (error) {
                console.error("Export failed:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to export users";
                toast.error(errorMessage);
                return false;
            }
        },
        [exportMutation],
    );

    return {
        exportUsers,
        isLoading,
    };
};
