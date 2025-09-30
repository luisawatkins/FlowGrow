import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Input, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="flex items-center w-full max-w-2xl">
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search properties..."
        size="lg"
        pr="4.5rem"
      />
      <IconButton
        aria-label="Search properties"
        icon={<SearchIcon />}
        size="lg"
        ml="-48px"
        zIndex="1"
        variant="ghost"
      />
    </div>
  );
};
