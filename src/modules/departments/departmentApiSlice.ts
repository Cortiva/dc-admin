// store/api/departmentApiSlice.ts

import { apiSlice } from "../../store/apiSlice";
import type { ApiEnvelope } from "../../types/api";
import type {
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
    DepartmentSearchFilters,
    DepartmentListResponse,
    DepartmentResponse,
    // DepartmentStatsResponse,
    DepartmentMemberResponse,
    ExportDepartmentRequest,
} from "../../types/department.types";

export const departmentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── CRUD ───────────────────────────────────────────────────────────

        getDepartments: builder.query<
            DepartmentListResponse,
            DepartmentSearchFilters
        >({
            query: (filters) => ({
                url: `/departments`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["Departments"],
        }),

        getDepartmentById: builder.query<DepartmentResponse, string>({
            query: (id) => ({
                url: `/departments/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, id) => [{ type: "Departments", id }],
        }),

        createDepartment: builder.mutation<
            DepartmentResponse,
            CreateDepartmentRequest
        >({
            query: (data) => ({
                url: `/departments`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Departments"],
        }),

        updateDepartment: builder.mutation<
            DepartmentResponse,
            { id: string; data: UpdateDepartmentRequest }
        >({
            query: ({ id, data }) => ({
                url: `/departments/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "Departments", id }],
        }),

        deleteDepartment: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Departments"],
        }),

        // ─── Member Assignment ─────────────────────────────────────────────

        assignMemberToDepartment: builder.mutation<
            DepartmentMemberResponse,
            { memberId: string; departmentId: string }
        >({
            query: (data) => ({
                url: `/departments/assign`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Departments", "Members"],
        }),

        removeMemberFromDepartment: builder.mutation<
            { success: boolean },
            string
        >({
            query: (memberId) => ({
                url: `/departments/remove`,
                method: "POST",
                body: { memberId },
            }),
            invalidatesTags: ["Departments", "Members"],
        }),

        getDepartmentMembers: builder.query<DepartmentMemberResponse[], string>(
            {
                query: (departmentId) => ({
                    url: `/departments/${departmentId}/members`,
                    method: "GET",
                }),
                transformResponse: (
                    response: ApiEnvelope<DepartmentMemberResponse[]>,
                ) => response.data,
                providesTags: (_, __, departmentId) => [
                    { type: "Departments", id: departmentId },
                ],
            },
        ),

        // ─── Stats ─────────────────────────────────────────────────────────

        getDepartmentStats: builder.query<any, void>({
            query: () => ({
                url: `/departments/fetch/stats`,
                method: "GET",
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
            providesTags: ["Departments"],
        }),

        // ─── Export ────────────────────────────────────────────────────────

        exportDepartments: builder.mutation<Blob, ExportDepartmentRequest>({
            query: (data) => ({
                url: `/departments/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useGetDepartmentsQuery,
    useGetDepartmentByIdQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useAssignMemberToDepartmentMutation,
    useRemoveMemberFromDepartmentMutation,
    useGetDepartmentMembersQuery,
    useGetDepartmentStatsQuery,
    useExportDepartmentsMutation,
} = departmentApiSlice;
