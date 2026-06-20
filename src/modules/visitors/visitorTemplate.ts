import ExcelJS from "exceljs";
import {
    COLUMN_HEADERS,
    EDUCATION_VALUES,
    ENUM_LABELS,
    GENDER_VALUES,
    HOW_HEARD_VALUES,
    SERVICE_TYPE_VALUES,
    VISITOR_IMPORT_COLUMNS,
    type VisitorImportColumn,
} from "./visitorValidation";

// Columns that get a real Excel dropdown (data validation list) rather
// than free text. Boolean columns get TRUE/FALSE dropdowns too, since
// "enter TRUE or FALSE" as plain text invites typos like "ture".
const DROPDOWN_SOURCES: Partial<Record<VisitorImportColumn, string[]>> = {
    gender: GENDER_VALUES.map((v) => ENUM_LABELS[v]),
    howHeardAboutUs: HOW_HEARD_VALUES.map((v) => ENUM_LABELS[v]),
    levelOfEducation: EDUCATION_VALUES.map((v) => ENUM_LABELS[v]),
    serviceType: SERVICE_TYPE_VALUES.map((v) => ENUM_LABELS[v]),
    preferenceToReturn: ["TRUE", "FALSE"],
    isBeliever: ["TRUE", "FALSE"],
};

const SAMPLE_ROW: Record<VisitorImportColumn, string | number> = {
    firstName: "Adaeze",
    lastName: "Nwosu",
    phone: "+234 803 555 1212",
    email: "adaeze.nwosu@example.com",
    gender: "Female",
    homeAddress: "12 Bode Thomas Street, Surulere",
    howHeardAboutUs: "Friend or Family",
    age: 27,
    levelOfEducation: "Tertiary",
    localGovernmentArea: "Surulere",
    birthday: "1998-04-12",
    preferenceToReturn: "TRUE",
    whatTheyLovedMost: "The worship and warm welcome",
    isBeliever: "TRUE",
    serviceType: "Sunday Service",
    visitDate: "2026-06-14",
    notes: "Came with a friend from work",
};

const DATA_ROW_COUNT = 200; // how many rows get dropdown validation applied

export async function generateVisitorImportTemplate(): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Dominion City";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Visitors");

    // Header row
    const headerValues = VISITOR_IMPORT_COLUMNS.map(
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

    // Sample row directly under the header, visually distinguished so
    // it's obvious it's an example and not the user's real first record.
    const sampleValues = VISITOR_IMPORT_COLUMNS.map((col) => SAMPLE_ROW[col]);
    const sampleRow = sheet.addRow(sampleValues);
    sampleRow.eachCell((cell) => {
        cell.font = { italic: true, color: { argb: "FF9CA3AF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF3F4F6" },
        };
    });

    // Column widths sized to header label length, with a sensible floor.
    VISITOR_IMPORT_COLUMNS.forEach((col, i) => {
        const width = Math.max(COLUMN_HEADERS[col].length + 4, 14);
        sheet.getColumn(i + 1).width = width;
    });

    // Apply dropdown data validation down DATA_ROW_COUNT rows below the
    // sample row (Excel validation can't easily be made to auto-extend
    // for arbitrarily-pasted rows, so we pre-apply it generously).
    const firstDataRow = 3;
    const lastDataRow = firstDataRow + DATA_ROW_COUNT - 1;

    VISITOR_IMPORT_COLUMNS.forEach((col, colIdx) => {
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

    // Freeze header so it stays visible while scrolling a long sheet.
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    // A short instructions sheet — reduces "what does this column mean"
    // support questions before they happen.
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
        "Fill in one row per visitor, starting on row 3 of the Visitors sheet. Row 2 is a filled-in example — replace or delete it.",
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
        '"Would Return" and "Is Believer" accept TRUE or FALSE only.',
    ]);
    infoSheet.addRow([
        "5.",
        "Save this file and upload it back into the Visitors page. You'll be able to review and fix any issues before anything is saved.",
    ]);
    infoSheet.eachRow((row, i) => {
        if (i > 1) row.alignment = { wrapText: true, vertical: "top" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
}

export function downloadVisitorImportTemplate(): void {
    generateVisitorImportTemplate().then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "visitor-import-template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}
