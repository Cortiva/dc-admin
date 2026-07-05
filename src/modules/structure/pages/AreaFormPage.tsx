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
import { useCreateAreaMutation, useUpdateAreaMutation } from "../structureApiSlice";
import { handleApiError } from "../../../utils/functions";
import { apiSlice } from "../../../store/apiSlice";
import type { AreaResponse } from "../../../types/structure.types";

export default function AreaFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const areaFromState = location.state?.area as AreaResponse | undefined;
    const isEdit = !!areaFromState;

    const [formData, setFormData] = useState({
        name: areaFromState?.name || "",
        description: areaFromState?.description || "",
    });

    const [createArea, { isLoading: isCreating }] = useCreateAreaMutation();
    const [updateArea, { isLoading: isUpdating }] = useUpdateAreaMutation();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const refetchAreas = async () => {
        dispatch(apiSlice.util.invalidateTags(["Areas", "StructureStats"]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Area name is required");
            return;
        }

        try {
            if (isEdit) {
                await updateArea({ 
                    id: areaFromState!.id, 
                    data: formData 
                }).unwrap();
                toast.success("Area updated successfully");
            } else {
                await createArea(formData).unwrap();
                toast.success("Area created successfully");
            }

            await refetchAreas();
            navigate("/structure");
        } catch (error) {
            handleApiError(error);
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/structure")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title={isEdit ? "Edit Area" : "Add Area"}
                    subtitle={isEdit ? "Update area information" : "Create a new church area"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Area Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                placeholder="Enter area name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Enter area description"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/structure")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name.trim()}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update Area" : "Create Area"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}