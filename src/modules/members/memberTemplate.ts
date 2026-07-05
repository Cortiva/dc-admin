import ExcelJS from "exceljs";
import {
    COLUMN_HEADERS,
    ENUM_LABELS,
    GENDER_VALUES,
    MEMBER_IMPORT_COLUMNS,
    type MemberImportColumn,
} from "./memberImportValidation";

const DROPDOWN_SOURCES: Partial<Record<MemberImportColumn, string[]>> = {
    gender: GENDER_VALUES.map((v) => ENUM_LABELS[v]),
    isMarried: ["TRUE", "FALSE"],
    isBeliever: ["TRUE", "FALSE"],
    attendedDCABasic: ["TRUE", "FALSE"],
    attendedDCAMerit: ["TRUE", "FALSE"],
    attendedEncounter: ["TRUE", "FALSE"],
};

const SAMPLE_ROW: Record<MemberImportColumn, string | number> = {
    firstName: "Oluwaseun",
    lastName: "Adebayo",
    phone: "+234 803 555 1212",
    email: "oluwaseun.adebayo@example.com",
    gender: "Male",
    homeAddress: "12 Bode Thomas Street, Surulere",
    localGovernmentArea: "Surulere",
    birthday: "1985-04-12",
    isMarried: "TRUE",
    weddingDate: "2010-06-14",
    isBeliever: "TRUE",
    attendedDCABasic: "TRUE",
    attendedDCAMerit: "FALSE",
    attendedEncounter: "FALSE",
    cellName: "Grace Cell",
    departmentName: "Worship",
};

const DATA_ROW_COUNT = 200;

export async function generateMemberImportTemplate(): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Dominion City";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Members");

    // Header row
    const headerValues = MEMBER_IMPORT_COLUMNS.map(
        (col) => COLUMN_HEADERS[col],
    );
    const headerRow = sheet.addRow(headerValues);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF00A86B" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
    });
    headerRow.height = 22;

    // Sample row
    const sampleValues = MEMBER_IMPORT_COLUMNS.map((col) => SAMPLE_ROW[col]);
    const sampleRow = sheet.addRow(sampleValues);
    sampleRow.eachCell((cell) => {
        cell.font = { italic: true, color: { argb: "FF9CA3AF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF3F4F6" },
        };
    });

    // Column widths
    MEMBER_IMPORT_COLUMNS.forEach((col, i) => {
        const width = Math.max(COLUMN_HEADERS[col].length + 4, 14);
        sheet.getColumn(i + 1).width = width;
    });

    // Apply dropdown data validation
    const firstDataRow = 3;
    const lastDataRow = firstDataRow + DATA_ROW_COUNT - 1;

    MEMBER_IMPORT_COLUMNS.forEach((col, colIdx) => {
        const options = DROPDOWN_SOURCES[col];
        if (!options) return;

        const colLetter = sheet.getColumn(colIdx + 1).letter;
        const formula = `"${options.join(",")}"`;

        for (let row = firstDataRow; row <= lastDataRow; row++) {
            sheet.getCell(`${colLetter}${row}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [formula],
                showErrorMessage: true,
                errorStyle: "warning",
                errorTitle: "Invalid value",
                error: `Please choose one of: ${options.join(", ")}`,
            };
        }
    });

    // Freeze header
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    // Instructions sheet
    const infoSheet = workbook.addWorksheet("Instructions");
    infoSheet.getColumn(1).width = 28;
    infoSheet.getColumn(2).width = 70;
    infoSheet.addRow(["How to use this template", ""]).font = {
        bold: true,
        size: 13,
    };
    infoSheet.addRow([]);
    infoSheet.addRow([
        "1.",
        "Fill in one row per member, starting on row 3 of the Members sheet. Row 2 is a filled-in example — replace or delete it.",
    ]);
    infoSheet.addRow([
        "2.",
        "Columns with a dropdown arrow only accept the listed values — click the cell and choose from the list.",
    ]);
    infoSheet.addRow([
        "3.",
        "Dates must be in YYYY-MM-DD format, e.g. 2026-06-20.",
    ]);
    infoSheet.addRow([
        "4.",
        '"TRUE/FALSE" columns accept TRUE or FALSE only (or yes/no, 1/0).',
    ]);
    infoSheet.addRow([
        "5.",
        "Cell and Department names must match existing ones in the system.",
    ]);
    infoSheet.addRow([
        "6.",
        "Save this file and upload it back. You'll be able to review and fix any issues before anything is saved.",
    ]);
    infoSheet.eachRow((row, i) => {
        if (i > 1) row.alignment = { wrapText: true, vertical: "top" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
}

export function downloadMemberImportTemplate(): void {
    generateMemberImportTemplate().then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "member-import-template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}
