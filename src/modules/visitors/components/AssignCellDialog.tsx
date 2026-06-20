import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Search, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { Visitor } from "../types/visitor.types";
import { useAssignVisitorCellMutation } from "../visitorApiSlice";
import { useFetchCellsQuery } from "../../structure/structureApiSlice";
import { handleApiError } from "../../../utils/functions";

interface AssignCellDialogProps {
    visitor: Visitor | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssignCellDialog({ visitor, onClose, onSuccess }: AssignCellDialogProps) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCellId, setSelectedCellId] = useState<string | null>(visitor?.cellId ?? null);
    const [assignCell, { isLoading }] = useAssignVisitorCellMutation();

    // Debounce so the cell search doesn't fire a request per keystroke.
    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(handle);
    }, [search]);

    const { data: cellsResponse, isFetching } = useFetchCellsQuery(
        { page: 1, limit: 20, search: debouncedSearch },
        { skip: !visitor },
    );
    const candidates = cellsResponse?.data.content ?? [];

    const handleClose = () => {
        setSearch("");
        setDebouncedSearch("");
        setSelectedCellId(visitor?.cellId ?? null);
        onClose();
    };

    const handleConfirm = async () => {
        if (!visitor || !selectedCellId) return;
        try {
            await assignCell({ id: visitor.id, data: { cellId: selectedCellId } }).unwrap();
            toast.success(`${visitor.firstName} has been assigned to a cell`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={!!visitor} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign to a cell</DialogTitle>
                    <DialogDescription>
                        Choose a cell for {visitor?.firstName} {visitor?.lastName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search cells..."
                        className="pl-9"
                        autoFocus
                    />
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1">
                    {isFetching ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Loading cells...
                        </div>
                    ) : candidates.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No matching cells.
                        </p>
                    ) : (
                        candidates.map((cell) => {
                            const isSelected = selectedCellId === cell.id;
                            return (
                                <button
                                    key={cell.id}
                                    type="button"
                                    onClick={() => setSelectedCellId(cell.id)}
                                    className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-lg text-left transition-colors ${
                                        isSelected
                                            ? "bg-primary/10 border border-primary/30"
                                            : "hover:bg-muted/50 border border-transparent"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{cell.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {cell.zoneName} · {cell.areaName}
                                        </p>
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedCellId || isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}