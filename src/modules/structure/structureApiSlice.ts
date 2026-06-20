import { apiSlice } from "../../store/apiSlice";
import type { ApiResponse, SpringPage } from "../../types/api";
import type {
    Area,
    Zone,
    Cell,
    AreaDetail,
    ZoneDetail,
    CreateAreaRequest,
    UpdateAreaRequest,
    CreateZoneRequest,
    UpdateZoneRequest,
    CreateCellRequest,
    UpdateCellRequest,
    UpdateLeaderRequest,
    StructureFilterParams,
} from "./types/structure.types";

const toQueryParams = (filters: StructureFilterParams) => ({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
});

export const structureApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── Areas ──────────────────────────────────────────────
        fetchAreas: builder.query<
            ApiResponse<SpringPage<Area>>,
            StructureFilterParams
        >({
            query: (filters) => ({
                url: "/areas",
                params: toQueryParams(filters),
            }),
            providesTags: ["Areas"],
        }),

        fetchArea: builder.query<ApiResponse<AreaDetail>, string>({
            query: (id) => ({ url: `/areas/${id}` }),
            providesTags: (_result, _error, id) => [{ type: "Areas", id }],
        }),

        createArea: builder.mutation<ApiResponse<Area>, CreateAreaRequest>({
            query: (data) => ({ url: `/areas`, method: "POST", body: data }),
            invalidatesTags: ["Areas"],
        }),

        updateArea: builder.mutation<
            ApiResponse<Area>,
            { id: string; data: UpdateAreaRequest }
        >({
            query: ({ id, data }) => ({
                url: `/areas/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Areas",
                { type: "Areas", id },
            ],
        }),

        updateAreaLeader: builder.mutation<
            ApiResponse<Area>,
            { id: string; data: UpdateLeaderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/areas/${id}/leader`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Areas",
                { type: "Areas", id },
            ],
        }),

        // ── Zones ──────────────────────────────────────────────
        fetchZones: builder.query<
            ApiResponse<SpringPage<Zone>>,
            StructureFilterParams
        >({
            query: (filters) => ({
                url: "/zones",
                params: toQueryParams(filters),
            }),
            providesTags: ["Zones"],
        }),

        fetchZone: builder.query<ApiResponse<ZoneDetail>, string>({
            query: (id) => ({ url: `/zones/${id}` }),
            providesTags: (_result, _error, id) => [{ type: "Zones", id }],
        }),

        createZone: builder.mutation<ApiResponse<Zone>, CreateZoneRequest>({
            query: (data) => ({ url: `/zones`, method: "POST", body: data }),
            // A new zone changes its parent area's child list too, so the
            // area detail cache (keyed by areaId) needs invalidating —
            // not just the flat zones list.
            invalidatesTags: (_result, _error, { areaId }) => [
                "Zones",
                { type: "Areas", id: areaId },
            ],
        }),

        updateZone: builder.mutation<
            ApiResponse<Zone>,
            { id: string; data: UpdateZoneRequest }
        >({
            query: ({ id, data }) => ({
                url: `/zones/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Zones",
                { type: "Zones", id },
            ],
        }),

        updateZoneLeader: builder.mutation<
            ApiResponse<Zone>,
            { id: string; data: UpdateLeaderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/zones/${id}/leader`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Zones",
                { type: "Zones", id },
            ],
        }),

        // ── Cells ──────────────────────────────────────────────
        fetchCells: builder.query<
            ApiResponse<SpringPage<Cell>>,
            StructureFilterParams
        >({
            query: (filters) => ({
                url: "/cells",
                params: toQueryParams(filters),
            }),
            providesTags: ["Cells"],
        }),

        fetchCell: builder.query<ApiResponse<{ cell: Cell }>, string>({
            query: (id) => ({ url: `/cells/${id}` }),
            providesTags: (_result, _error, id) => [{ type: "Cells", id }],
        }),

        createCell: builder.mutation<ApiResponse<Cell>, CreateCellRequest>({
            query: (data) => ({ url: `/cells`, method: "POST", body: data }),
            // Same reasoning as createZone — invalidate the parent zone's
            // detail cache so its cells list refreshes too.
            invalidatesTags: (_result, _error, { zoneId }) => [
                "Cells",
                { type: "Zones", id: zoneId },
            ],
        }),

        updateCell: builder.mutation<
            ApiResponse<Cell>,
            { id: string; data: UpdateCellRequest }
        >({
            query: ({ id, data }) => ({
                url: `/cells/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Cells",
                { type: "Cells", id },
            ],
        }),

        updateCellLeader: builder.mutation<
            ApiResponse<Cell>,
            { id: string; data: UpdateLeaderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/cells/${id}/leader`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Cells",
                { type: "Cells", id },
            ],
        }),
    }),
});

export const {
    useFetchAreasQuery,
    useFetchAreaQuery,
    useCreateAreaMutation,
    useUpdateAreaMutation,
    useUpdateAreaLeaderMutation,
    useFetchZonesQuery,
    useFetchZoneQuery,
    useCreateZoneMutation,
    useUpdateZoneMutation,
    useUpdateZoneLeaderMutation,
    useFetchCellsQuery,
    useFetchCellQuery,
    useCreateCellMutation,
    useUpdateCellMutation,
    useUpdateCellLeaderMutation,
} = structureApiSlice;
