'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, MapPin, Clock, Star } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'property' | 'location' | 'recent' | 'saved';
  icon?: React.ReactNode;
}

interface MobileSearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  className?: string;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  onSearch,
  onFilter,
  placeholder = "Search properties, locations...",
  suggestions = [],
  recentSearches = [],
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0 || isFocused);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    onSearch(search);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Search size={16} className="text-blue-500" />;
      case 'location':
        return <MapPin size={16} className="text-green-500" />;
      case 'recent':
        return <Clock size={16} className="text-gray-500" />;
      case 'saved':
        return <Star size={16} className="text-yellow-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={20} className="text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="
              w-full pl-10 pr-20 py-3 bg-white border border-gray-200 rounded-2xl
              text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:border-transparent transition-all duration-200
              text-base
            "
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            
            {onFilter && (
              <button
                type="button"
                onClick={onFilter}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Filter size={18} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3">
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span>{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && filteredSuggestions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <Search size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No suggestions found</p>
              <p className="text-xs mt-1">Try searching for properties or locations</p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default MobileSearchBar;
