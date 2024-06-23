import {BaseModel, PaginationResponse} from "..";

export const getPaginationResponse = function <T>(data: T[], page: number, limit: number, total_count: number): PaginationResponse<T[]> {
    let responseBody: PaginationResponse<T[]> = {
        items: data,
        total_count: 0,
        pages_count: 0,
    }

    if (!data || data.length === 0)
        return responseBody;

    responseBody.total_count = total_count;
    responseBody.pages_count = Math.ceil(total_count / limit);
    return responseBody;
}

export const buildPagination = function <T extends BaseModel>(data: T[], page: number = 1, limit: number = 12): PaginationResponse<T> {
    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 10;

    let responseBody: any = {
        items: data,
        total_count: 0,
        pages_count: 0,
    }

    if (!data || data.length === 0)
        return responseBody;

    const total_count = Number(data && data.length > 0 ? data[0].count : 0);
    responseBody.total_count = total_count;
    responseBody.pages_count = Math.ceil(total_count / limit);
    responseBody.last = total_count <= page * limit;
    return responseBody;
}