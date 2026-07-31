'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  CLIENT_SORT_OPTIONS,
  parseClientListQueryState,
} from '@/lib/clients/client-query-state';
import type { ClientListQueryState, HasFilterValue } from '@/lib/clients/client-query-state';
import { serializeClientListQueryState } from '@/lib/clients/client-query-state';

const DEBOUNCE_MS = 400;
const MAX_SEARCH_LENGTH = 100;

interface ClientListToolbarProps {
  resultCount?: number;
}

export function ClientListToolbar({ resultCount }: ClientListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseClientListQueryState(searchParams);
  const [searchInput, setSearchInput] = useState(query.q);
  const [syncedQ, setSyncedQ] = useState(query.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resync the local input when the committed URL value changes externally (e.g. "Clear search").
  // Adjusting state during render, per React's guidance, avoids an extra effect-driven render.
  if (query.q !== syncedQ) {
    setSyncedQ(query.q);
    setSearchInput(query.q);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function navigate(next: ClientListQueryState) {
    const params = serializeClientListQueryState(next);
    const target = params.toString().length > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(target);
  }

  function handleSearchChange(value: string) {
    const limited = value.slice(0, MAX_SEARCH_LENGTH);
    setSearchInput(limited);

    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      navigate({ ...query, q: limited.trim(), page: 1 });
    }, DEBOUNCE_MS);
  }

  function handleClearSearch() {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    setSearchInput('');
    navigate({ ...query, q: '', page: 1 });
  }

  function handleHasEmailChange(value: HasFilterValue) {
    navigate({ ...query, hasEmail: value, page: 1 });
  }

  function handleHasPhoneChange(value: HasFilterValue) {
    navigate({ ...query, hasPhone: value, page: 1 });
  }

  function handleSortChange(value: string) {
    const option = CLIENT_SORT_OPTIONS.find((item) => item.value === value);

    if (option === undefined) {
      return;
    }

    navigate({ ...query, sortBy: option.field, sortOrder: option.direction, page: 1 });
  }

  function handleClearFilters() {
    navigate({ ...query, hasEmail: 'any', hasPhone: 'any', page: 1 });
  }

  const hasActiveFilters = query.hasEmail !== 'any' || query.hasPhone !== 'any';
  const currentSortValue = `${query.sortBy}:${query.sortOrder}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="client-search" className="sr-only">
            Search clients
          </label>
          <input
            id="client-search"
            type="search"
            placeholder="Search by name, company, email, or phone"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            maxLength={MAX_SEARCH_LENGTH}
            className="border-border bg-surface text-foreground placeholder:text-muted focus-visible:ring-accent w-full rounded-md border px-3 py-2 pr-14 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          />
          {searchInput.length > 0 ? (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="text-muted hover:text-foreground focus-visible:ring-accent absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-1.5 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="client-sort" className="text-muted text-sm font-medium">
            Sort
          </label>
          <select
            id="client-sort"
            value={currentSortValue}
            onChange={(event) => handleSortChange(event.target.value)}
            className="border-border bg-surface text-foreground focus-visible:ring-accent rounded-md border px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {CLIENT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-has-email" className="text-muted text-sm font-medium">
            Has email
          </label>
          <select
            id="filter-has-email"
            value={query.hasEmail}
            onChange={(event) => handleHasEmailChange(event.target.value as HasFilterValue)}
            className="border-border bg-surface text-foreground focus-visible:ring-accent rounded-md border px-2 py-1 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="any">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filter-has-phone" className="text-muted text-sm font-medium">
            Has phone
          </label>
          <select
            id="filter-has-phone"
            value={query.hasPhone}
            onChange={(event) => handleHasPhoneChange(event.target.value as HasFilterValue)}
            className="border-border bg-surface text-foreground focus-visible:ring-accent rounded-md border px-2 py-1 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="any">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-accent focus-visible:ring-accent rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Clear filters
          </button>
        ) : null}

        {resultCount !== undefined ? (
          <span className="text-muted ml-auto text-sm">
            {resultCount} result{resultCount === 1 ? '' : 's'}
          </span>
        ) : null}
      </div>
    </div>
  );
}
