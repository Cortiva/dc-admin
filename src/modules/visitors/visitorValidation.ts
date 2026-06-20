import type {
    Gender,
    HowHeardAboutUs,
    LevelOfEducation,
    ServiceType,
} from "./types/visitor.types";

export const GENDER_VALUES: Gender[] = ["MALE", "FEMALE"];

export const HOW_HEARD_VALUES: HowHeardAboutUs[] = [
    "SOCIAL_MEDIA",
    "FRIEND_OR_FAMILY",
    "CHURCH_MEMBER",
    "FLYER_OR_BANNER",
    "WEBSITE",
    "WALK_IN",
    "OTHER",
];

export const EDUCATION_VALUES: LevelOfEducation[] = [
    "NO_FORMAL_EDUCATION",
    "PRIMARY",
    "SECONDARY",
    "TERTIARY",
    "POSTGRADUATE",
];

export const SERVICE_TYPE_VALUES: ServiceType[] = [
    "SUNDAY_SERVICE",
    "MIDWEEK_SERVICE",
    "SPECIAL_EVENT",
    "OTHER",
];

// Human-friendly labels for display in the UI and the template.
export const ENUM_LABELS: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    SOCIAL_MEDIA: "Social Media",
    FRIEND_OR_FAMILY: "Friend or Family",
    CHURCH_MEMBER: "Church Member",
    FLYER_OR_BANNER: "Flyer or Banner",
    WEBSITE: "Website",
    WALK_IN: "Walk-in",
    OTHER: "Other",
    NO_FORMAL_EDUCATION: "No Formal Education",
    PRIMARY: "Primary",
    SECONDARY: "Secondary",
    TERTIARY: "Tertiary",
    POSTGRADUATE: "Postgraduate",
    SUNDAY_SERVICE: "Sunday Service",
    MIDWEEK_SERVICE: "Midweek Service",
    SPECIAL_EVENT: "Special Event",
};

// The exact column order used in the template AND expected on import —
// keeping these as one source of truth so the template generator and the
// sheet parser can never drift apart.
export const VISITOR_IMPORT_COLUMNS = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "gender",
    "homeAddress",
    "howHeardAboutUs",
    "age",
    "levelOfEducation",
    "localGovernmentArea",
    "birthday",
    "preferenceToReturn",
    "whatTheyLovedMost",
    "isBeliever",
    "serviceType",
    "visitDate",
    "notes",
] as const;

export type VisitorImportColumn = (typeof VISITOR_IMPORT_COLUMNS)[number];

export const COLUMN_HEADERS: Record<VisitorImportColumn, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    email: "Email",
    gender: "Gender",
    homeAddress: "Home Address",
    howHeardAboutUs: "How Heard About Us",
    age: "Age",
    levelOfEducation: "Level of Education",
    localGovernmentArea: "Local Government Area",
    birthday: "Birthday (YYYY-MM-DD)",
    preferenceToReturn: "Would Return (TRUE/FALSE)",
    whatTheyLovedMost: "What They Loved Most",
    isBeliever: "Is Believer (TRUE/FALSE)",
    serviceType: "Service Type",
    visitDate: "Visit Date (YYYY-MM-DD)",
    notes: "Notes",
};

export type RawImportRow = Record<VisitorImportColumn, string>;

export interface ImportRowErrors {
    [field: string]: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_RE = /^[+\d][\d\s-]{6,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (v: unknown) =>
    v === undefined || v === null || String(v).trim() === "";

const parseBoolLoose = (v: string): boolean | null => {
    const norm = v.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(norm)) return true;
    if (["false", "no", "n", "0"].includes(norm)) return false;
    return null;
};

// Validates a single raw row (all values as strings, as they arrive from
// either an Excel cell or an inline-edited table cell) and returns a map
// of field -> error message. An empty object means the row is fully valid.
export function validateVisitorRow(row: RawImportRow): ImportRowErrors {
    const errors: ImportRowErrors = {};

    if (isBlank(row.firstName)) errors.firstName = "First name is required";
    if (isBlank(row.lastName)) errors.lastName = "Last name is required";

    if (isBlank(row.phone)) {
        errors.phone = "Phone is required";
    } else if (!PHONE_RE.test(row.phone.trim())) {
        errors.phone = "Enter a valid phone number";
    }

    if (isBlank(row.email)) {
        errors.email = "Email is required";
    } else if (!EMAIL_RE.test(row.email.trim())) {
        errors.email = "Enter a valid email address";
    }

    if (isBlank(row.gender)) {
        errors.gender = "Gender is required";
    } else if (
        !GENDER_VALUES.includes(row.gender.trim().toUpperCase() as Gender)
    ) {
        errors.gender = `Must be one of: ${GENDER_VALUES.map((v) => ENUM_LABELS[v]).join(", ")}`;
    }

    if (isBlank(row.homeAddress))
        errors.homeAddress = "Home address is required";

    if (isBlank(row.howHeardAboutUs)) {
        errors.howHeardAboutUs = "Required";
    } else if (
        !HOW_HEARD_VALUES.includes(
            row.howHeardAboutUs.trim().toUpperCase() as HowHeardAboutUs,
        )
    ) {
        errors.howHeardAboutUs = "Choose a value from the dropdown list";
    }

    if (isBlank(row.age)) {
        errors.age = "Age is required";
    } else {
        const ageNum = Number(row.age);
        if (!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 120) {
            errors.age = "Enter a whole number between 0 and 120";
        }
    }

    if (isBlank(row.levelOfEducation)) {
        errors.levelOfEducation = "Required";
    } else if (
        !EDUCATION_VALUES.includes(
            row.levelOfEducation.trim().toUpperCase() as LevelOfEducation,
        )
    ) {
        errors.levelOfEducation = "Choose a value from the dropdown list";
    }

    if (isBlank(row.localGovernmentArea)) {
        errors.localGovernmentArea = "Local government area is required";
    }

    if (isBlank(row.birthday)) {
        errors.birthday = "Birthday is required";
    } else if (!DATE_RE.test(row.birthday.trim())) {
        errors.birthday = "Use YYYY-MM-DD format";
    } else if (Number.isNaN(new Date(row.birthday).getTime())) {
        errors.birthday = "Not a valid date";
    }

    if (isBlank(row.preferenceToReturn)) {
        errors.preferenceToReturn = "Required";
    } else if (parseBoolLoose(row.preferenceToReturn) === null) {
        errors.preferenceToReturn = "Enter TRUE or FALSE";
    }

    if (isBlank(row.whatTheyLovedMost)) {
        errors.whatTheyLovedMost = "Required";
    }

    if (isBlank(row.isBeliever)) {
        errors.isBeliever = "Required";
    } else if (parseBoolLoose(row.isBeliever) === null) {
        errors.isBeliever = "Enter TRUE or FALSE";
    }

    if (isBlank(row.serviceType)) {
        errors.serviceType = "Required";
    } else if (
        !SERVICE_TYPE_VALUES.includes(
            row.serviceType.trim().toUpperCase() as ServiceType,
        )
    ) {
        errors.serviceType = "Choose a value from the dropdown list";
    }

    if (isBlank(row.visitDate)) {
        errors.visitDate = "Visit date is required";
    } else if (!DATE_RE.test(row.visitDate.trim())) {
        errors.visitDate = "Use YYYY-MM-DD format";
    } else if (Number.isNaN(new Date(row.visitDate).getTime())) {
        errors.visitDate = "Not a valid date";
    }

    // notes is optional — no validation.

    return errors;
}

// Converts a validated raw row into the exact payload shape the backend
// expects. Only call this on rows with zero validation errors.
export function toCreateVisitorRequest(row: RawImportRow) {
    return {
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        phone: row.phone.trim(),
        email: row.email.trim(),
        gender: row.gender.trim().toUpperCase() as Gender,
        homeAddress: row.homeAddress.trim(),
        howHeardAboutUs: row.howHeardAboutUs
            .trim()
            .toUpperCase() as HowHeardAboutUs,
        age: Number(row.age),
        levelOfEducation: row.levelOfEducation
            .trim()
            .toUpperCase() as LevelOfEducation,
        localGovernmentArea: row.localGovernmentArea.trim(),
        birthday: row.birthday.trim(),
        preferenceToReturn: parseBoolLoose(row.preferenceToReturn) ?? false,
        whatTheyLovedMost: row.whatTheyLovedMost.trim(),
        isBeliever: parseBoolLoose(row.isBeliever) ?? false,
        serviceType: row.serviceType.trim().toUpperCase() as ServiceType,
        visitDate: row.visitDate.trim(),
        notes: row.notes?.trim() ?? "",
    };
}
