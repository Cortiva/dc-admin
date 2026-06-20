import type {
    User,
    UserRole,
    UserStatus,
} from "../modules/users/types/user.types";

const FIRST_NAMES = [
    "Adebayo",
    "Chidinma",
    "Oluwaseun",
    "Ngozi",
    "Tunde",
    "Folake",
    "Emeka",
    "Yetunde",
    "Chukwudi",
    "Aisha",
    "Bolaji",
    "Ifeoma",
    "Segun",
    "Kemi",
    "Obinna",
    "Funmilayo",
];
const LAST_NAMES = [
    "Okafor",
    "Adeyemi",
    "Eze",
    "Bello",
    "Nwachukwu",
    "Adebisi",
    "Okonkwo",
    "Lawal",
    "Uche",
    "Ogundipe",
    "Abiola",
    "Chukwu",
];
const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "USER"];
const STATUSES: UserStatus[] = [
    "ACTIVE",
    "ACTIVE",
    "ACTIVE",
    "ACTIVE", // weighted toward active
    "PENDING_INVITE",
    "PENDING_APPROVAL",
    "SUSPENDED",
    "REJECTED",
];

const pick = <T>(arr: T[], seed: number) => arr[seed % arr.length];

export const usersData: User[] = Array.from({ length: 42 }, (_, i) => {
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i + 3);
    const role: UserRole = i === 0 ? "SUPER_ADMIN" : pick(ROLES, i + 1);
    const status: UserStatus = i === 0 ? "ACTIVE" : pick(STATUSES, i + 5);
    const daysAgo = (i * 7) % 365;

    return {
        id: `usr_${(i + 1).toString().padStart(4, "0")}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@dominioncity.org`,
        phoneNumber:
            status === "PENDING_INVITE"
                ? null
                : `+234 80${(i % 9) + 1} ${String(1000000 + i * 137).slice(0, 7)}`,
        role,
        status,
        createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    };
});
