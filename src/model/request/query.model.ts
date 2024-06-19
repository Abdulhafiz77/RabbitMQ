import { PaginationParams } from ".";

export interface QueryParams  extends PaginationParams{
    status: number | undefined;
}
