import { useState, useCallback } from 'react';

export const useSearch = (initialQuery: string = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['code']);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const toggleFilter = useCallback((filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedFilters(['code']);
  }, []);

  return {
    query,
    selectedFilters,
    handleQueryChange,
    toggleFilter,
    resetFilters
  };
};
