export interface Member {
    id: number;
    fullName: string;
    address: string;
    zone: string;
    phoneNumber: string;
    gender: string;
    avatar: string;
    maritalStatus: string;
    dateOfBirth: string;
    weddingDate: string | null;
    occupation: string;
    attendedDcaBasic: boolean;
    attendedDcaMaturity: boolean;
    attendedDli: boolean;
    department: string;
}

export interface MemberFilterParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    zone?: string;
    department?: string;
    attendedDcaBasic?: boolean;
}
