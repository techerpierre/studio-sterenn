export interface PaginationParams {
    page?: number;
    take?: number;
}

export interface RelativeOrder {
    beforeId?: string;
    afterId?: string;
}
