import type {
    Area,
    Cell,
    LeaderRef,
    Zone,
} from "../modules/structure/types/structure.types";
import { usersData } from "./users";

const toLeaderRef = (u: (typeof usersData)[number]): LeaderRef => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
});

const leaders = usersData.filter((u) => u.status === "ACTIVE").map(toLeaderRef);
const leaderAt = (i: number) => leaders[i % leaders.length];

const AREA_NAMES = ["Surulere Central", "Surulere West", "Surulere East"];

export const areasData: Area[] = AREA_NAMES.map((name, i) => ({
    id: `area_${(i + 1).toString().padStart(3, "0")}`,
    name,
    description: `${name} oversight area, covering nearby zones and cells.`,
    leader: leaderAt(i),
    createdAt: new Date(Date.now() - (i + 1) * 90 * 86400000).toISOString(),
}));

const ZONE_NAMES_BY_AREA: Record<string, string[]> = {
    area_001: [
        "Ijesha Zone",
        "Bode Thomas Zone",
        "Ojuelegba Zone",
        "Eric Moore Zone",
    ],
    area_002: ["Alhaji Masha Zone", "Ogunlana Zone", "Itire Zone"],
    area_003: [
        "Lawanson Zone",
        "Shitta Zone",
        "Adelabu Zone",
        "Odi Olowu Zone",
    ],
};

export const zonesData: Zone[] = areasData.flatMap((area, areaIdx) =>
    (ZONE_NAMES_BY_AREA[area.id] ?? []).map((name, i) => ({
        id: `zone_${area.id.slice(-3)}_${(i + 1).toString().padStart(2, "0")}`,
        name,
        description: `${name} under ${area.name}.`,
        areaId: area.id,
        areaName: area.name,
        leader: leaderAt(areaIdx * 5 + i + 1),
        createdAt: new Date(Date.now() - (i + 1) * 60 * 86400000).toISOString(),
    })),
);

const CELL_NAME_PREFIXES = [
    "Grace",
    "Mercy",
    "Victory",
    "Faith",
    "Hope",
    "Glory",
    "Power",
];

export const cellsData: Cell[] = zonesData.flatMap((zone, zoneIdx) =>
    Array.from({ length: 3 + (zoneIdx % 3) }, (_, i) => {
        const prefix =
            CELL_NAME_PREFIXES[(zoneIdx + i) % CELL_NAME_PREFIXES.length];
        return {
            id: `cell_${zone.id.replace("zone_", "")}_${(i + 1).toString().padStart(2, "0")}`,
            name: `${prefix} Cell`,
            description: `${prefix} Cell, part of ${zone.name}.`,
            zoneId: zone.id,
            zoneName: zone.name,
            areaId: zone.areaId,
            areaName: zone.areaName,
            leader: leaderAt(zoneIdx * 3 + i + 2),
            createdAt: new Date(
                Date.now() - (i + 1) * 30 * 86400000,
            ).toISOString(),
        };
    }),
);
