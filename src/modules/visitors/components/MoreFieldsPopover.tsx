import { Button } from "../../../components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../components/ui/popover";
import { Label } from "../../../components/ui/label";
import { ChevronDown, AlertCircle } from "lucide-react";
import { ImportCell } from "./ImportCell";
import { COLUMN_HEADERS, type RawImportRow, type VisitorImportColumn } from "../visitorValidation";

interface MoreFieldsPopoverTriggerProps {
    row: { id: string; data: RawImportRow; errors: Record<string, string> };
    secondaryColumns: VisitorImportColumn[];
    secondaryErrorCount: number;
    onChangeCell: (rowId: string, column: keyof RawImportRow, value: string) => void;
}

export function MoreFieldsPopoverTrigger({
    row,
    secondaryColumns,
    secondaryErrorCount,
    onChangeCell,
}: MoreFieldsPopoverTriggerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                    {secondaryErrorCount > 0 ? (
                        <span className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {secondaryErrorCount} issue{secondaryErrorCount === 1 ? "" : "s"}
                        </span>
                    ) : (
                        "View / edit"
                    )}
                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-96 overflow-y-auto space-y-3" align="start">
                {secondaryColumns.map((col) => (
                    <div key={col} className="space-y-1.5">
                        <Label className="text-xs">{COLUMN_HEADERS[col]}</Label>
                        <ImportCell
                            column={col}
                            value={row.data[col]}
                            error={row.errors[col]}
                            onChange={(value) => onChangeCell(row.id, col, value)}
                        />
                        {row.errors[col] && (
                            <p className="text-xs text-red-600">{row.errors[col]}</p>
                        )}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
}