export type Paginated<T = any> = {
    results: T[];
    count: number;
};