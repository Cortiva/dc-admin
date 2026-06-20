import { Input } from "../../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { EDUCATION_VALUES, ENUM_LABELS, GENDER_VALUES, HOW_HEARD_VALUES, SERVICE_TYPE_VALUES, type VisitorImportColumn } from "../visitorValidation";

interface ImportCellProps {
    column: VisitorImportColumn;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

const DROPDOWN_OPTIONS: Partial<Record<VisitorImportColumn, string[]>> = {
    gender: GENDER_VALUES,
    howHeardAboutUs: HOW_HEARD_VALUES,
    levelOfEducation: EDUCATION_VALUES,
    serviceType: SERVICE_TYPE_VALUES,
    preferenceToReturn: ["TRUE", "FALSE"],
    isBeliever: ["TRUE", "FALSE"],
};

const DATE_COLUMNS: VisitorImportColumn[] = ["birthday", "visitDate"];
const NUMBER_COLUMNS: VisitorImportColumn[] = ["age"];

export function ImportCell({ column, value, error, onChange }: ImportCellProps) {
    const options = DROPDOWN_OPTIONS[column];
    const isBooleanCol = column === "preferenceToReturn" || column === "isBeliever";

    const baseClass = `h-9 text-sm ${error ? "border-red-400 focus-visible:ring-red-400" : ""}`;

    if (options) {
        // Normalize whatever's currently there (could be "true", "Yes",
        // "MALE", "Male" etc. from a messy upload) to the canonical enum
        // value for the Select to recognize it as selected.
        const normalized = isBooleanCol
            ? ["true", "yes", "y", "1"].includes(value.trim().toLowerCase())
                ? "TRUE"
                : ["false", "no", "n", "0"].includes(value.trim().toLowerCase())
                  ? "FALSE"
                  : ""
            : options.find((o) => o.toLowerCase() === value.trim().toLowerCase()) ?? "";

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
            type={
                DATE_COLUMNS.includes(column)
                    ? "date"
                    : NUMBER_COLUMNS.includes(column)
                      ? "number"
                      : "text"
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
        />
    );
}