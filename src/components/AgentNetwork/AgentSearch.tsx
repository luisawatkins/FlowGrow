import React, { useState, useEffect } from 'react';
import { Agent, AgentSearchFilters } from '@/types/agent';
import { useAgent } from '@/hooks/useAgent';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AgentProfile } from './AgentProfile';

interface AgentSearchProps {
  onAgentSelect?: (agent: Agent) => void;
  showResults?: boolean;
  maxResults?: number;
}

export const AgentSearch: React.FC<AgentSearchProps> = ({
  onAgentSelect,
  showResults = true,
  maxResults = 10
}) => {
  const { searchResults, searchLoading, searchAgents } = useAgent();
  const [filters, setFilters] = useState<AgentSearchFilters>({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    setSearchPerformed(true);
    await searchAgents(filters);
  };

  const handleFilterChange = (key: keyof AgentSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchPerformed(false);
  };

  const specialtyOptions = [
    'Luxury Homes',
    'First-time Buyers',
    'Investment Properties',
    'Commercial Real Estate',
    'Property Management',
    'Foreclosures',
    'New Construction',
    'Condos',
    'Townhouses',
    'Single Family Homes'
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'Mandarin',
    'Cantonese',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Japanese',
    'Korean'
  ];

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Your Perfect Agent</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              type="text"
              placeholder="City, State, or ZIP"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.specialties?.[0] || ''}
              onChange={(e) => handleFilterChange('specialties', e.target.value ? [e.target.value] : [])}
            >
              <option value="">Select specialty</option>
              {specialtyOptions.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.languages?.[0] || ''}
              onChange={(e) => handleFilterChange('languages', e.target.value ? [e.target.value] : [])}
            >
              <option value="">Select language</option>
              {languageOptions.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {/* Experience Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Experience (years)
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={filters.experience?.min || ''}
              onChange={(e) => handleFilterChange('experience', {
                ...filters.experience,
                min: parseInt(e.target.value) || 0
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Experience (years)
            </label>
            <Input
              type="number"
              placeholder="50"
              min="0"
              max="50"
              value={filters.experience?.max || ''}
              onChange={(e) => handleFilterChange('experience', {
                ...filters.experience,
                max: parseInt(e.target.value) || 50
              })}
            />
          </div>

          {/* Rating Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Rating
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.rating?.min || ''}
              onChange={(e) => handleFilterChange('rating', {
                ...filters.rating,
                min: parseFloat(e.target.value) || 0
              })}
            >
              <option value="">Any rating</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4.0">4.0+ stars</option>
              <option value="3.5">3.5+ stars</option>
              <option value="3.0">3.0+ stars</option>
            </select>
          </div>

          {/* Commission Rate Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Commission Rate (%)
            </label>
            <Input
              type="number"
              placeholder="1.0"
              min="0"
              max="10"
              step="0.1"
              value={filters.commissionRate?.min || ''}
              onChange={(e) => handleFilterChange('commissionRate', {
                ...filters.commissionRate,
                min: parseFloat(e.target.value) || 0
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Commission Rate (%)
            </label>
            <Input
              type="number"
              placeholder="5.0"
              min="0"
              max="10"
              step="0.1"
              value={filters.commissionRate?.max || ''}
              onChange={(e) => handleFilterChange('commissionRate', {
                ...filters.commissionRate,
                max: parseFloat(e.target.value) || 10
              })}
            />
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.isVerified === undefined ? '' : filters.isVerified.toString()}
              onChange={(e) => handleFilterChange('isVerified', 
                e.target.value === '' ? undefined : e.target.value === 'true'
              )}
            >
              <option value="">Any status</option>
              <option value="true">Verified only</option>
              <option value="false">Unverified only</option>
            </select>
          </div>
        </div>

        {/* Search Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSearch}
            disabled={searchLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {searchLoading ? 'Searching...' : 'Search Agents'}
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex-1"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      {showResults && searchPerformed && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length} agents found)
            </h3>
            {searchLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading...
              </div>
            )}
          </div>

          {searchResults.length === 0 && !searchLoading ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                <p className="text-gray-500">Try adjusting your search criteria to find more agents.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {searchResults.slice(0, maxResults).map((agent) => (
                <AgentProfile
                  key={agent.id}
                  agent={agent}
                  onContact={(agentId) => {
                    const selectedAgent = searchResults.find(a => a.id === agentId);
                    if (selectedAgent) {
                      onAgentSelect?.(selectedAgent);
                    }
                  }}
                />
              ))}
              
              {searchResults.length > maxResults && (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Showing {maxResults} of {searchResults.length} agents. 
                    <button className="text-blue-600 hover:text-blue-700 ml-1">
                      View all results
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
