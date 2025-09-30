// Comments Filters Component

'use client';

import React from 'react';
import { CommentsFilter } from '@/types/notes';

interface CommentsFiltersProps {
  filter: CommentsFilter;
  onFilterChange: (filter: CommentsFilter) => void;
}

export const CommentsFilters: React.FC<CommentsFiltersProps> = ({
  filter,
  onFilterChange
}) => {
  const handleApprovalChange = (isApproved: boolean | undefined) => {
    onFilterChange({ ...filter, isApproved });
  };

  const handleModerationChange = (isModerated: boolean | undefined) => {
    onFilterChange({ ...filter, isModerated });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filter, search });
  };

  const clearFilters = () => {
    onFilterChange({
      isApproved: undefined,
      isModerated: undefined,
      search: ''
    });
  };

  const hasActiveFilters = filter.isApproved !== undefined || filter.isModerated !== undefined || filter.search;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filter Comments</h3>
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
            placeholder="Search comments..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Approval Status */}
        <div>
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-1">
            Approval Status
          </label>
          <select
            id="approval"
            value={filter.isApproved === undefined ? '' : filter.isApproved.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleApprovalChange(value === '' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All comments</option>
            <option value="true">Approved only</option>
            <option value="false">Pending only</option>
          </select>
        </div>

        {/* Moderation Status */}
        <div>
          <label htmlFor="moderation" className="block text-sm font-medium text-gray-700 mb-1">
            Moderation Status
          </label>
          <select
            id="moderation"
            value={filter.isModerated === undefined ? '' : filter.isModerated.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleModerationChange(value === '' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All comments</option>
            <option value="false">Not moderated</option>
            <option value="true">Moderated</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filter.isApproved !== undefined && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md">
                Status: {filter.isApproved ? 'Approved' : 'Pending'}
                <button
                  onClick={() => handleApprovalChange(undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filter.isModerated !== undefined && (
              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm rounded-md">
                Moderation: {filter.isModerated ? 'Moderated' : 'Not moderated'}
                <button
                  onClick={() => handleModerationChange(undefined)}
                  className="ml-1 text-red-600 hover:text-red-800"
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
