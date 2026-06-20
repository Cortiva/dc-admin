import { useMemo } from "react";
import { CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../../../components/ui/tooltip";
import { COLUMN_HEADERS, validateVisitorRow, VISITOR_IMPORT_COLUMNS, type RawImportRow } from "../visitorValidation";
import { ImportCell } from "./ImportCell";
import { MoreFieldsPopoverTrigger } from "./MoreFieldsPopover";

export interface ImportRowState {
    id: string;
    data: RawImportRow;
}

interface ImportReviewTableProps {
    rows: ImportRowState[];
    onChangeCell: (rowId: string, column: keyof RawImportRow, value: string) => void;
    onRemoveRow: (rowId: string) => void;
}

// Columns shown in a condensed core set on screen — every field is still
// editable and validated, but a 17-column table is unusable on any
// screen. We show the most failure-prone / identity columns directly and
// let the rest live in an expandable "More fields" cell per row.
const PRIMARY_COLUMNS = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "gender",
    "age",
] as const;

export function ImportReviewTable({ rows, onChangeCell, onRemoveRow }: ImportReviewTableProps) {
    const rowsWithErrors = useMemo(
        () =>
            rows.map((r) => ({
                ...r,
                errors: validateVisitorRow(r.data),
            })),
        [rows],
    );

    return (
        <div className="border rounded-lg overflow-x-auto bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-10">
                            <span className="sr-only">Status</span>
                        </TableHead>
                        <TableHead className="w-10">#</TableHead>
                        {PRIMARY_COLUMNS.map((col) => (
                            <TableHead key={col} className="min-w-35">
                                {COLUMN_HEADERS[col]}
                            </TableHead>
                        ))}
                        <TableHead>More fields</TableHead>
                        <TableHead className="w-10 text-right">
                            <span className="sr-only">Remove</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rowsWithErrors.map((row, index) => {
                        const errorCount = Object.keys(row.errors).length;
                        const isValid = errorCount === 0;
                        const secondaryColumns = VISITOR_IMPORT_COLUMNS.filter(
                            (c) => !PRIMARY_COLUMNS.includes(c as (typeof PRIMARY_COLUMNS)[number]),
                        );
                        const secondaryErrorCount = secondaryColumns.filter(
                            (c) => row.errors[c],
                        ).length;

                        return (
                            <TableRow
                                key={row.id}
                                className={isValid ? "" : "bg-red-50/50 dark:bg-red-950/10"}
                            >
                                <TableCell>
                                    {isValid ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <AlertCircle className="w-4 h-4 text-red-500 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {errorCount} field{errorCount === 1 ? "" : "s"} need
                                                attention
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {index + 1}
                                </TableCell>

                                {PRIMARY_COLUMNS.map((col) => (
                                    <TableCell key={col} className="py-2">
                                        <ImportCell
                                            column={col}
                                            value={row.data[col]}
                                            error={row.errors[col]}
                                            onChange={(value) => onChangeCell(row.id, col, value)}
                                        />
                                        {row.errors[col] && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {row.errors[col]}
                                            </p>
                                        )}
                                    </TableCell>
                                ))}

                                <TableCell className="py-2">
                                    <MoreFieldsPopoverTrigger
                                        row={row}
                                        secondaryColumns={secondaryColumns}
                                        secondaryErrorCount={secondaryErrorCount}
                                        onChangeCell={onChangeCell}
                                    />
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemoveRow(row.id)}
                                        aria-label="Remove row"
                                        className="text-muted-foreground hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}