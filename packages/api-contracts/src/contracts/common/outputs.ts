export type Paginated<T = any> = {
    results: T[];
    count: number;
};

export enum EventStatus {
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
}

export interface EventData<T> {
    status: EventStatus;
    data: T;
    message?: string;
}