export type PaginationParams = {
  page: number;
  take: number;
};

export type Paginated<T = any> = {
  results: T[];
  count: number;
};

export type SessionUserParam = {
  sessionUserId?: string;
};

export type RelativeOrder = {
  beforeId?: string;
  afterId?: string;
};

