// Neighborhood Search Component
// Search interface for neighborhoods

'use client';

import React, { useState } from 'react';
import { NeighborhoodSearchRequest } from '@/types/neighborhood';

interface NeighborhoodSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string, filters?: any) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export const NeighborhoodSearch: React.FC<NeighborhoodSearchProps> = ({
  query,
  onQueryChange,
  onSearch,
  loading = false,
  placeholder = 'Search neighborhoods, cities, or areas...',
  className = ''
}) => {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQueryChange(localQuery);
    onSearch(localQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    onQueryChange(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    onQueryChange('');
    onSearch('');
  };

  return (
    <div className={`neighborhood-search ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={loading}
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-12 flex items-center pr-3"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400 hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Quick search:</span>
        {['Downtown', 'Marina', 'Mission', 'Castro', 'Haight'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setLocalQuery(suggestion);
              onQueryChange(suggestion);
              onSearch(suggestion);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            disabled={loading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
