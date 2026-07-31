import type { ClientSortDirection, ClientSortField } from '@/types/client';

interface ClientSortOption {
  value: string;
  label: string;
  field: ClientSortField;
  direction: ClientSortDirection;
}

export const CLIENT_SORT_OPTIONS: ClientSortOption[] = [
  { value: 'createdAt:desc', label: 'Newest first', field: 'createdAt', direction: 'desc' },
  { value: 'createdAt:asc', label: 'Oldest first', field: 'createdAt', direction: 'asc' },
  { value: 'name:asc', label: 'Name A–Z', field: 'name', direction: 'asc' },
  { value: 'name:desc', label: 'Name Z–A', field: 'name', direction: 'desc' },
  { value: 'updatedAt:desc', label: 'Recently updated', field: 'updatedAt', direction: 'desc' },
  { value: 'company:asc', label: 'Company A–Z', field: 'company', direction: 'asc' },
];

const DEFAULT_SORT = CLIENT_SORT_OPTIONS[0]!;

const SORT_FIELDS: ClientSortField[] = ['name', 'company', 'createdAt', 'updatedAt'];
const SORT_DIRECTIONS: ClientSortDirection[] = ['asc', 'desc'];
const MAX_SEARCH_LENGTH = 100;

export const CLIENT_LIST_PAGE_SIZE = 20;

export type HasFilterValue = 'any' | 'yes' | 'no';

export interface ClientListQueryState {
  q: string;
  page: number;
  sortBy: ClientSortField;
  sortOrder: ClientSortDirection;
  hasEmail: HasFilterValue;
  hasPhone: HasFilterValue;
}

export const DEFAULT_CLIENT_LIST_QUERY_STATE: ClientListQueryState = {
  q: '',
  page: 1,
  sortBy: DEFAULT_SORT.field,
  sortOrder: DEFAULT_SORT.direction,
  hasEmail: 'any',
  hasPhone: 'any',
};

function parseHasFilter(value: string | null): HasFilterValue {
  return value === 'yes' || value === 'no' ? value : 'any';
}

function parseSortField(value: string | null): ClientSortField {
  return (SORT_FIELDS as string[]).includes(value ?? '')
    ? (value as ClientSortField)
    : DEFAULT_SORT.field;
}

function parseSortDirection(value: string | null): ClientSortDirection {
  return (SORT_DIRECTIONS as string[]).includes(value ?? '')
    ? (value as ClientSortDirection)
    : DEFAULT_SORT.direction;
}

function parsePage(value: string | null): number {
  if (value === null) {
    return 1;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

export function parseClientListQueryState(searchParams: URLSearchParams): ClientListQueryState {
  const rawQ = (searchParams.get('q') ?? '').trim().slice(0, MAX_SEARCH_LENGTH);

  return {
    q: rawQ,
    page: parsePage(searchParams.get('page')),
    sortBy: parseSortField(searchParams.get('sortBy')),
    sortOrder: parseSortDirection(searchParams.get('sortOrder')),
    hasEmail: parseHasFilter(searchParams.get('hasEmail')),
    hasPhone: parseHasFilter(searchParams.get('hasPhone')),
  };
}

export function serializeClientListQueryState(state: ClientListQueryState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.q.length > 0) {
    params.set('q', state.q);
  }

  if (state.page !== 1) {
    params.set('page', String(state.page));
  }

  if (state.sortBy !== DEFAULT_SORT.field || state.sortOrder !== DEFAULT_SORT.direction) {
    params.set('sortBy', state.sortBy);
    params.set('sortOrder', state.sortOrder);
  }

  if (state.hasEmail !== 'any') {
    params.set('hasEmail', state.hasEmail);
  }

  if (state.hasPhone !== 'any') {
    params.set('hasPhone', state.hasPhone);
  }

  return params;
}

export function hasStructuredFilters(state: ClientListQueryState): boolean {
  return state.hasEmail !== 'any' || state.hasPhone !== 'any';
}

export function hasFilterToBoolean(value: HasFilterValue): boolean | undefined {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

export function buildListHref(pathname: string, state: ClientListQueryState): string {
  const query = serializeClientListQueryState(state).toString();
  return query.length > 0 ? `${pathname}?${query}` : pathname;
}
