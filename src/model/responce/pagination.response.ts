export interface PaginationResponse<T> {

    total_count: number;

    pages_count: number;

    items: T;
}

export const emptyData: PaginationResponse<any> = {
    total_count: 0,
    pages_count: 0,
    items: []
}