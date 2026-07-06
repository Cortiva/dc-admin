import { apiSlice } from "../../store/apiSlice";
import type {
    CreateAreaRequest,
    UpdateAreaRequest,
    CreateZoneRequest,
    UpdateZoneRequest,
    CreateCellRequest,
    UpdateCellRequest,
    StructureSearchFilters,
    StructureListResponse,
    AreaResponse,
    ZoneResponse,
    CellResponse,
    AssignLeaderRequest,
    ExportStructureRequest,
    CellTransferRequest,
    CellTransferResponse,
} from "../../types/structure.types";

export const structureApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── AREAS ───────────────────────────────────────────────────────────

        getAreas: builder.query<
            StructureListResponse<AreaResponse>,
            StructureSearchFilters
        >({
            query: (filters) => ({
                url: `/structure/areas`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["Areas"],
        }),

        getAreaById: builder.query<AreaResponse, string>({
            query: (id) => ({
                url: `/structure/areas/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, id) => [{ type: "Areas", id }],
        }),

        createArea: builder.mutation<AreaResponse, CreateAreaRequest>({
            query: (data) => ({
                url: `/structure/areas`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Areas", "StructureStats"],
        }),

        updateArea: builder.mutation<
            AreaResponse,
            { id: string; data: UpdateAreaRequest }
        >({
            query: ({ id, data }) => ({
                url: `/structure/areas/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "Areas", id }],
        }),

        deleteArea: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/structure/areas/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Areas", "StructureStats"],
        }),

        assignAreaLeader: builder.mutation<
            AreaResponse,
            { id: string; data: AssignLeaderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/structure/areas/${id}/assign-leader`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "Areas", id }],
        }),

        removeAreaLeader: builder.mutation<AreaResponse, string>({
            query: (id) => ({
                url: `/structure/areas/${id}/remove-leader`,
                method: "POST",
            }),
            invalidatesTags: (_, __, id) => [{ type: "Areas", id }],
        }),

        // ─── ZONES ───────────────────────────────────────────────────────────

        getZones: builder.query<
            StructureListResponse<ZoneResponse>,
            StructureSearchFilters
        >({
            query: (filters) => ({
                url: `/structure/zones`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["Zones"],
        }),

        getZoneById: builder.query<ZoneResponse, string>({
            query: (id) => ({
                url: `/structure/zones/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, id) => [{ type: "Zones", id }],
        }),

        createZone: builder.mutation<ZoneResponse, CreateZoneRequest>({
            query: (data) => ({
                url: `/structure/zones`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Zones", "Areas", "StructureStats"],
        }),

        updateZone: builder.mutation<
            ZoneResponse,
            { id: string; data: UpdateZoneRequest }
        >({
            query: ({ id, data }) => ({
                url: `/structure/zones/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: "Zones", id },
                "Areas",
            ],
        }),

        deleteZone: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/structure/zones/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Zones", "Areas", "StructureStats"],
        }),

        assignZoneLeader: builder.mutation<
            ZoneResponse,
            { id: string; data: AssignLeaderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/structure/zones/${id}/assign-leader`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "Zones", id }],
        }),

        removeZoneLeader: builder.mutation<ZoneResponse, string>({
            query: (id) => ({
                url: `/structure/zones/${id}/remove-leader`,
                method: "POST",
            }),
            invalidatesTags: (_, __, id) => [{ type: "Zones", id }],
        }),

        // ─── CELLS ───────────────────────────────────────────────────────────

        getCells: builder.query<
            StructureListResponse<CellResponse>,
            StructureSearchFilters
        >({
            query: (filters) => ({
                url: `/structure/cells`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["Cells"],
        }),

        getCellById: builder.query<CellResponse, string>({
            query: (id) => ({
                url: `/structure/cells/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, id) => [{ type: "Cells", id }],
        }),

        createCell: builder.mutation<CellResponse, CreateCellRequest>({
            query: (data) => ({
                url: `/structure/cells`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cells", "Zones", "Areas", "StructureStats"],
        }),

        updateCell: builder.mutation<
            CellResponse,
            { id: string; data: UpdateCellRequest }
        >({
            query: ({ id, data }) => ({
                url: `/structure/cells/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: "Cells", id },
                "Zones",
            ],
        }),

        deleteCell: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/structure/cells/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cells", "Zones", "Areas", "StructureStats"],
        }),

        assignCellLeader: builder.mutation<
            CellResponse,
            { id: string; data: AssignLeaderRequest }
        >({
            query: ({ id, data }) => ({
                url: `/structure/cells/${id}/assign-leader`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "Cells", id }],
        }),

        removeCellLeader: builder.mutation<CellResponse, string>({
            query: (id) => ({
                url: `/structure/cells/${id}/remove-leader`,
                method: "POST",
            }),
            invalidatesTags: (_, __, id) => [{ type: "Cells", id }],
        }),

        // ─── STATISTICS ──────────────────────────────────────────────────────

        getStructureStats: builder.query<any, void>({
            query: () => ({
                url: `/structure/stats`,
                method: "GET",
            }),
            providesTags: ["StructureStats"],
        }),

        // ─── EXPORT ──────────────────────────────────────────────────────────

        exportStructure: builder.mutation<Blob, ExportStructureRequest>({
            query: (data) => ({
                url: `/structure/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),

        // ─── CELL TRANSFER ──────────────────────────────────────────────────

        transferMember: builder.mutation<
            CellTransferResponse,
            CellTransferRequest
        >({
            query: (data) => ({
                url: `/structure/transfer-member`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cells", "Members"],
        }),
    }),
});

export const {
    useGetAreasQuery,
    useGetAreaByIdQuery,
    useCreateAreaMutation,
    useUpdateAreaMutation,
    useDeleteAreaMutation,
    useAssignAreaLeaderMutation,
    useRemoveAreaLeaderMutation,

    useGetZonesQuery,
    useGetZoneByIdQuery,
    useCreateZoneMutation,
    useUpdateZoneMutation,
    useDeleteZoneMutation,
    useAssignZoneLeaderMutation,
    useRemoveZoneLeaderMutation,

    useGetCellsQuery,
    useGetCellByIdQuery,
    useCreateCellMutation,
    useUpdateCellMutation,
    useDeleteCellMutation,
    useAssignCellLeaderMutation,
    useRemoveCellLeaderMutation,

    useGetStructureStatsQuery,
    useExportStructureMutation,
    useTransferMemberMutation,
} = structureApiSlice;
