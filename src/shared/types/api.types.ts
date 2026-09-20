export interface PaginationParams {
    page: number;
    pageSize?: number;
    paginated: boolean;
}

export interface PaginationResponse {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: PaginationResponse;
}

export interface ApiErrorResponse {
    error: string;
    code?: string;
    details?: any;
}
