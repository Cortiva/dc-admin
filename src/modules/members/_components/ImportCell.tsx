import { Input } from "../../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { ENUM_LABELS, GENDER_VALUES, type MemberImportColumn } from "../memberImportValidation";

interface ImportCellProps {
    column: MemberImportColumn;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

const DROPDOWN_OPTIONS: Partial<Record<MemberImportColumn, string[]>> = {
    gender: GENDER_VALUES,
    isMarried: ["TRUE", "FALSE"],
    isBeliever: ["TRUE", "FALSE"],
    attendedDCABasic: ["TRUE", "FALSE"],
    attendedDCAMerit: ["TRUE", "FALSE"],
    attendedEncounter: ["TRUE", "FALSE"],
};

const DATE_COLUMNS: MemberImportColumn[] = ["birthday", "weddingDate"];

export function ImportCell({ column, value, error, onChange }: ImportCellProps) {
    const options = DROPDOWN_OPTIONS[column];

    const baseClass = `h-9 text-sm ${error ? "border-red-400 focus-visible:ring-red-400" : ""}`;

    if (options) {
        const normalized = options.find(
            (o) => o.toLowerCase() === value.trim().toLowerCase(),
        ) ?? "";

        return (
            <Select value={normalized} onValueChange={onChange}>
                <SelectTrigger className={baseClass}>
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {ENUM_LABELS[opt] ?? opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <Input
            type={DATE_COLUMNS.includes(column) ? "date" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
        />
    );
}