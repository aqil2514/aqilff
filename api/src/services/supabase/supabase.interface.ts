export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'ilike'
  | 'like'
  | 'in'
  | 'is';

export interface Filter {
  key: string;
  operator: FilterOperator;
  value: any;
}

export interface QueryOptions {
  filters?: Filter[];
  sort?: { key: string; direction?: 'asc' | 'desc' }[];
  limit?: number;
  page?: number;
  select?: string;
}
