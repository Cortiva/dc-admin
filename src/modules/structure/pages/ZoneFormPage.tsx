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
import { useCreateZoneMutation, useUpdateZoneMutation, useGetAreasQuery } from "../structureApiSlice";
import { handleApiError } from "../../../utils/functions";
import { apiSlice } from "../../../store/apiSlice";
import type { AreaResponse, ZoneResponse } from "../../../types/structure.types";

export default function ZoneFormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const zoneFromState = location.state?.zone as ZoneResponse | undefined;
    const areaFromState = location.state?.area as { id: string; name: string } | undefined;
    const isEdit = !!zoneFromState;

    const [formData, setFormData] = useState({
        name: zoneFromState?.name || "",
        description: zoneFromState?.description || "",
        areaId: zoneFromState?.areaId || areaFromState?.id || "",
    });

    const { data: areas } = useGetAreasQuery({ limit: 100 });
    const [createZone, { isLoading: isCreating }] = useCreateZoneMutation();
    const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const refetchZones = async () => {
        dispatch(apiSlice.util.invalidateTags(["Zones", "Areas", "StructureStats"]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Zone name is required");
            return;
        }

        if (!formData.areaId) {
            toast.error("Please select an area");
            return;
        }

        try {
            if (isEdit) {
                await updateZone({ 
                    id: zoneFromState!.id, 
                    data: formData 
                }).unwrap();
                toast.success("Zone updated successfully");
            } else {
                await createZone(formData).unwrap();
                toast.success("Zone created successfully");
            }

            await refetchZones();
            navigate("/structure/zones");
        } catch (error) {
            handleApiError(error);
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/structure/zones")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    title={isEdit ? "Edit Zone" : "Add Zone"}
                    subtitle={isEdit ? "Update zone information" : "Create a new church zone"}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Zone Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                placeholder="Enter zone name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="areaId">Area *</Label>
                            <Select
                                value={formData.areaId}
                                onValueChange={(value) => handleChange("areaId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areas?.data?.map((area: AreaResponse) => (
                                        <SelectItem key={area.id} value={area.id}>
                                            {area.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Enter zone description"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-muted/30">
                        <Button variant="outline" type="button" onClick={() => navigate("/structure/zones")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name.trim() || !formData.areaId}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEdit ? "Update Zone" : "Create Zone"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}