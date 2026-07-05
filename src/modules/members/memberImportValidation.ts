import type { Gender } from "../../types/member.type";
import { normalizeNgPhone } from "../../utils/functions";

export const GENDER_VALUES: Gender[] = ["MALE", "FEMALE"];

export const ENUM_LABELS: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
};

// The exact column order used in the template AND expected on import
export const MEMBER_IMPORT_COLUMNS = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "gender",
    "homeAddress",
    "localGovernmentArea",
    "birthday",
    "isMarried",
    "weddingDate",
    "isBeliever",
    "attendedDCABasic",
    "attendedDCAMerit",
    "attendedEncounter",
    "cellName",
    "departmentName",
] as const;

export type MemberImportColumn = (typeof MEMBER_IMPORT_COLUMNS)[number];

export const COLUMN_HEADERS: Record<MemberImportColumn, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    email: "Email",
    gender: "Gender",
    homeAddress: "Home Address",
    localGovernmentArea: "Local Government Area",
    birthday: "Birthday (YYYY-MM-DD)",
    isMarried: "Is Married (TRUE/FALSE)",
    weddingDate: "Wedding Date (YYYY-MM-DD)",
    isBeliever: "Is Believer (TRUE/FALSE)",
    attendedDCABasic: "Attended DCA Basic (TRUE/FALSE)",
    attendedDCAMerit: "Attended DCA Merit (TRUE/FALSE)",
    attendedEncounter: "Attended Encounter (TRUE/FALSE)",
    cellName: "Cell Name",
    departmentName: "Department Name",
};

export type RawImportRow = Record<MemberImportColumn, string>;

export interface ImportRowErrors {
    [field: string]: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (v: unknown) =>
    v === undefined || v === null || String(v).trim() === "";

const parseBoolLoose = (v: string): boolean | null => {
    const norm = v.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(norm)) return true;
    if (["false", "no", "n", "0"].includes(norm)) return false;
    return null;
};

export function validateMemberRow(row: RawImportRow): ImportRowErrors {
    const errors: ImportRowErrors = {};

    if (isBlank(row.firstName)) errors.firstName = "First name is required";
    if (isBlank(row.lastName)) errors.lastName = "Last name is required";

    if (isBlank(row.phone)) {
        errors.phone = "Phone is required";
    } else if (!normalizeNgPhone(row.phone)) {
        errors.phone =
            "Enter a valid Nigerian phone number (e.g. 0803 555 1212 or +234 803 555 1212)";
    }

    if (!isBlank(row.email) && !EMAIL_RE.test(row.email.trim())) {
        errors.email = "Enter a valid email address";
    }

    if (
        !isBlank(row.gender) &&
        !GENDER_VALUES.includes(row.gender.trim().toUpperCase() as Gender)
    ) {
        errors.gender = `Must be one of: ${GENDER_VALUES.map((v) => ENUM_LABELS[v]).join(", ")}`;
    }

    if (!isBlank(row.birthday) && !DATE_RE.test(row.birthday.trim())) {
        errors.birthday = "Use YYYY-MM-DD format";
    } else if (
        !isBlank(row.birthday) &&
        Number.isNaN(new Date(row.birthday).getTime())
    ) {
        errors.birthday = "Not a valid date";
    }

    if (!isBlank(row.weddingDate) && !DATE_RE.test(row.weddingDate.trim())) {
        errors.weddingDate = "Use YYYY-MM-DD format";
    } else if (
        !isBlank(row.weddingDate) &&
        Number.isNaN(new Date(row.weddingDate).getTime())
    ) {
        errors.weddingDate = "Not a valid date";
    }

    if (!isBlank(row.isMarried) && parseBoolLoose(row.isMarried) === null) {
        errors.isMarried = "Enter TRUE or FALSE";
    }

    if (!isBlank(row.isBeliever) && parseBoolLoose(row.isBeliever) === null) {
        errors.isBeliever = "Enter TRUE or FALSE";
    }

    if (
        !isBlank(row.attendedDCABasic) &&
        parseBoolLoose(row.attendedDCABasic) === null
    ) {
        errors.attendedDCABasic = "Enter TRUE or FALSE";
    }

    if (
        !isBlank(row.attendedDCAMerit) &&
        parseBoolLoose(row.attendedDCAMerit) === null
    ) {
        errors.attendedDCAMerit = "Enter TRUE or FALSE";
    }

    if (
        !isBlank(row.attendedEncounter) &&
        parseBoolLoose(row.attendedEncounter) === null
    ) {
        errors.attendedEncounter = "Enter TRUE or FALSE";
    }

    return errors;
}

export function toCreateMemberRequest(row: RawImportRow) {
    return {
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        phone: normalizeNgPhone(row.phone) ?? row.phone.trim(),
        email: row.email?.trim() || null,
        gender: (row.gender?.trim().toUpperCase() as Gender) || null,
        homeAddress: row.homeAddress?.trim() || null,
        localGovernmentArea: row.localGovernmentArea?.trim() || null,
        birthday: row.birthday?.trim() || null,
        isMarried: parseBoolLoose(row.isMarried || "false") ?? false,
        weddingDate: row.weddingDate?.trim() || null,
        isBeliever: parseBoolLoose(row.isBeliever || "true") ?? true,
        attendedDCABasic:
            parseBoolLoose(row.attendedDCABasic || "false") ?? false,
        attendedDCAMerit:
            parseBoolLoose(row.attendedDCAMerit || "false") ?? false,
        attendedEncounter:
            parseBoolLoose(row.attendedEncounter || "false") ?? false,
        cellName: row.cellName?.trim() || null,
        departmentName: row.departmentName?.trim() || null,
    };
}
