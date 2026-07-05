import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { useCreateCellMutation, useUpdateCellMutation, useGetZonesQuery } from "../structureApiSlice";
import { handleApiError } from "../../../utils/functions";
import { apiSlice } from "../../../store/apiSlice";
import type { CellResponse, ZoneResponse } from "../../../types/structure.types";

export default function CellFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cellFromState = location.state?.cell as CellResponse | undefined;
    const zoneFromState = location.state?.zone as { id: string; name: string } | undefined;
    const isEdit = !!cellFromState;

    const [formData, setFormData] = useState({
        name: cellFromState?.name || "",
        description: cellFromState?.description || "",
        zoneId: cellFromState?.zoneId || zoneFromState?.id || "",
    });

    const { data: zones, isLoading: zonesLoading } = useGetZonesQuery({ limit: 100 });
    const [createCell, { isLoading: isCreating }] = useCreateCellMutation();
    const [updateCell, { isLoading: isUpdating }] = useUpdateCellMutation();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const refetchCells = async () => {
        dispatch(apiSlice.util.invalidateTags(["Cells", "Zones", "Areas", "StructureStats"]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Cell name is required");
            return;
        }

        if (!formData.zoneId) {
            toast.error("Please select a zone");
            return;
        }

        try {
            if (isEdit) {
                await updateCell({
                    id: cellFromState!.id,
                    data: formData
                }).unwrap();
                toast.success("Cell updated successfully");
            } else {
                await createCell(formData).unwrap();
                toast.success("Cell created successfully");
            }

            await refetchCells();
            navigate("/structure/cells");
        } catch (error) {
            handleApiError(error);
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/structure/cells")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title={isEdit ? "Edit Cell" : "Add Cell"}
                    subtitle={isEdit ? "Update cell information" : "Create a new church cell"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Cell Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                placeholder="Enter cell name (e.g., Grace Cell, Faith Cell)"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zoneId">Zone *</Label>
                            <Select
                                value={formData.zoneId}
                                onValueChange={(value) => handleChange("zoneId", value)}
                                disabled={zonesLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={zonesLoading ? "Loading zones..." : "Select zone"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones?.data?.map((zone: ZoneResponse) => (
                                        <SelectItem key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </SelectItem>
                                    ))}
                                    {!zonesLoading && zones?.data?.length === 0 && (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No zones available. Create a zone first.
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                            {!zonesLoading && zones?.data?.length === 0 && (
                                <p className="text-xs text-amber-500">
                                    No zones found. Please create a zone first.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Enter cell description (e.g., Focus on young adults, Bible study group)"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/structure/cells")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name.trim() || !formData.zoneId}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update Cell" : "Create Cell"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}