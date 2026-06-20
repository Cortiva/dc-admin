import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import { toCreateVisitorRequest, validateVisitorRow, type RawImportRow } from "../visitorValidation";
import { ImportReviewTable, type ImportRowState } from "./ImportReviewtable";
import { useImportVisitorsMutation } from "../visitorApiSlice";

interface ImportReviewPanelProps {
    initialRows: RawImportRow[];
    onCancel: () => void;
    onImported: () => void;
}

let rowIdCounter = 0;
const nextRowId = () => `row_${++rowIdCounter}_${Date.now()}`;

export function ImportReviewPanel({ initialRows, onCancel, onImported }: ImportReviewPanelProps) {
    const [rows, setRows] = useState<ImportRowState[]>(() =>
        initialRows.map((data) => ({ id: nextRowId(), data })),
    );
    const [importVisitors, { isLoading: isSubmitting }] = useImportVisitorsMutation();

    const { validCount, invalidCount } = useMemo(() => {
        let valid = 0;
        let invalid = 0;
        rows.forEach((r) => {
            const errors = validateVisitorRow(r.data);
            if (Object.keys(errors).length === 0) valid++;
            else invalid++;
        });
        return { validCount: valid, invalidCount: invalid };
    }, [rows]);

    const allValid = rows.length > 0 && invalidCount === 0;

    const handleChangeCell = (rowId: string, column: keyof RawImportRow, value: string) => {
        setRows((prev) =>
            prev.map((r) => (r.id === rowId ? { ...r, data: { ...r.data, [column]: value } } : r)),
        );
    };

    const handleRemoveRow = (rowId: string) => {
        setRows((prev) => prev.filter((r) => r.id !== rowId));
    };

    const handleRemoveAllInvalid = () => {
        setRows((prev) => prev.filter((r) => Object.keys(validateVisitorRow(r.data)).length === 0));
        toast.success("Removed all flagged rows");
    };

    const handleSubmit = async () => {
        if (!allValid) return;
        try {
            const payload = rows.map((r) => toCreateVisitorRequest(r.data));
            const result = await importVisitors(payload).unwrap();
            toast.success(
                `${result.data?.created ?? rows.length} visitor${
                    rows.length === 1 ? "" : "s"
                } added`,
            );
            onImported();
        } catch (err) {
            handleApiError(err);
        }
    };

    if (rows.length === 0) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={onCancel} className="-ml-2">
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back
                </Button>
                <div className="text-center py-16 space-y-3">
                    <p className="font-medium">No rows left to import</p>
                    <p className="text-sm text-muted-foreground">
                        Every row was removed. Upload a sheet again to start over.
                    </p>
                    <Button variant="outline" onClick={onCancel}>
                        Start over
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onCancel} className="-ml-2">
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back
                </Button>
            </div>

            <div>
                <h2 className="text-xl font-semibold">Review before importing</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Fix anything flagged below, or remove the row. Nothing is saved until you
                    confirm at the bottom.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold">{rows.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total rows</p>
                </Card>
                <Card className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{validCount}</p>
                        <p className="text-xs text-muted-foreground">Ready to import</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">{invalidCount}</p>
                        <p className="text-xs text-muted-foreground">Need attention</p>
                    </div>
                    {invalidCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-red-600 hover:text-red-700"
                            onClick={handleRemoveAllInvalid}
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Remove all
                        </Button>
                    )}
                </Card>
            </div>

            <ImportReviewTable
                rows={rows}
                onChangeCell={handleChangeCell}
                onRemoveRow={handleRemoveRow}
            />

            {/* Sticky submit bar */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-60 border-t bg-card/95 backdrop-blur-sm p-4 z-40">
                <div className="max-w-full flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        {allValid
                            ? `All ${rows.length} rows are ready to import.`
                            : `${invalidCount} row${invalidCount === 1 ? "" : "s"} still need attention before you can import.`}
                    </p>
                    <Button onClick={handleSubmit} disabled={!allValid || isSubmitting} size="lg">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            `Import ${rows.length} visitor${rows.length === 1 ? "" : "s"}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}