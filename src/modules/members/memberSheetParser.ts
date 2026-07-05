import * as XLSX from "xlsx";
import {
    COLUMN_HEADERS,
    MEMBER_IMPORT_COLUMNS,
    type RawImportRow,
    type MemberImportColumn,
} from "./memberImportValidation";

const HEADER_TO_COLUMN = new Map(
    MEMBER_IMPORT_COLUMNS.map((col) => [
        COLUMN_HEADERS[col].toLowerCase().trim(),
        col,
    ]),
);

export interface ParsedSheetResult {
    rows: RawImportRow[];
    unrecognizedHeaders: string[];
    missingColumns: string[];
}

const cellToString = (value: unknown): string => {
    if (value === undefined || value === null) return "";
    if (value instanceof Date) {
        const yyyy = value.getFullYear();
        const mm = String(value.getMonth() + 1).padStart(2, "0");
        const dd = String(value.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    return String(value).trim();
};

export function parseMemberSheet(file: File): Promise<ParsedSheetResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, {
                    type: "array",
                    cellDates: true,
                });

                const sheetName =
                    workbook.SheetNames.find(
                        (n) => n.toLowerCase() !== "instructions",
                    ) ?? workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const matrix: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    blankrows: false,
                    defval: "",
                });

                if (matrix.length === 0) {
                    resolve({
                        rows: [],
                        unrecognizedHeaders: [],
                        missingColumns: [],
                    });
                    return;
                }

                const headerRow = matrix[0].map((h) =>
                    String(h).toLowerCase().trim(),
                );
                const columnForIndex: (MemberImportColumn | null)[] =
                    headerRow.map((h) => HEADER_TO_COLUMN.get(h) ?? null);

                const unrecognizedHeaders = headerRow.filter(
                    (h, i) => !columnForIndex[i] && h,
                );
                const foundColumns = new Set(columnForIndex.filter(Boolean));
                const missingColumns = MEMBER_IMPORT_COLUMNS.filter(
                    (c) => !foundColumns.has(c),
                ).map((c) => COLUMN_HEADERS[c]);

                const dataRows = matrix.slice(1);

                const rows: RawImportRow[] = dataRows
                    .filter((r) => r.some((cell) => String(cell).trim() !== ""))
                    .map((r) => {
                        const row = {} as RawImportRow;
                        MEMBER_IMPORT_COLUMNS.forEach((col) => {
                            const idx = columnForIndex.indexOf(col);
                            row[col] = idx === -1 ? "" : cellToString(r[idx]);
                        });
                        return row;
                    });

                resolve({ rows, unrecognizedHeaders, missingColumns });
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error("Could not read the file"));
        reader.readAsArrayBuffer(file);
    });
}
