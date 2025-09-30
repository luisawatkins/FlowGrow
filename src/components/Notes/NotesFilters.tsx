// Notes Filters Component

'use client';

import React from 'react';
import { NoteType, NotesFilter } from '@/types/notes';

interface NotesFiltersProps {
  filter: NotesFilter;
  onFilterChange: (filter: NotesFilter) => void;
}

export const NotesFilters: React.FC<NotesFiltersProps> = ({
  filter,
  onFilterChange
}) => {
  const handleTypeChange = (type: NoteType | undefined) => {
    onFilterChange({ ...filter, type });
  };

  const handlePrivacyChange = (isPrivate: boolean | undefined) => {
    onFilterChange({ ...filter, isPrivate });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filter, search });
  };

  const clearFilters = () => {
    onFilterChange({
      type: undefined,
      isPrivate: undefined,
      search: ''
    });
  };

  const hasActiveFilters = filter.type || filter.isPrivate !== undefined || filter.search;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filter Notes</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filter.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={filter.type || ''}
            onChange={(e) => handleTypeChange(e.target.value as NoteType || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All types</option>
            <option value={NoteType.GENERAL}>General</option>
            <option value={NoteType.VIEWING}>Viewing</option>
            <option value={NoteType.FINANCIAL}>Financial</option>
            <option value={NoteType.MAINTENANCE}>Maintenance</option>
            <option value={NoteType.MARKET}>Market</option>
            <option value={NoteType.PERSONAL}>Personal</option>
          </select>
        </div>

        {/* Privacy Filter */}
        <div>
          <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 mb-1">
            Privacy
          </label>
          <select
            id="privacy"
            value={filter.isPrivate === undefined ? '' : filter.isPrivate.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handlePrivacyChange(value === '' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All notes</option>
            <option value="true">Private only</option>
            <option value="false">Public only</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filter.type && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                Type: {filter.type}
                <button
                  onClick={() => handleTypeChange(undefined)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filter.isPrivate !== undefined && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md">
                Privacy: {filter.isPrivate ? 'Private' : 'Public'}
                <button
                  onClick={() => handlePrivacyChange(undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filter.search && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-md">
                Search: "{filter.search}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
