import React, { useRef, useEffect } from 'react';
import { Search, History } from 'lucide-react';
import { FilterOption } from '../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterToggle: (filterId: string) => void;
  queryHistory?: string[];
  onSelectHistory?: (query: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  filters,
  selectedFilters,
  onFilterToggle,
  queryHistory = [],
  onSelectHistory,
  placeholder = 'SEARCH CODE SEMANTICALLY',
  onSubmit
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectHistory = (q: string) => {
    onQueryChange(q);
    onSelectHistory?.(q);
    setShowHistory(false);
  };

  return (
    <section className="search-section">
      <div className="search-container" ref={containerRef}>
        <div className={`search-wrapper ${isActive ? 'active' : ''}`}>
          <button type="button" className="submit search-icon-wrapper" onClick={onSubmit}>
            <div className="search-icon-wrapper">
              <Search size={24} strokeWidth={1.5} />
            </div>
          </button>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => { setIsActive(true); setShowHistory(true); }}
            onBlur={() => setIsActive(false)}
          />
          {queryHistory.length > 0 && (
            <button
              type="button"
              className={`search-history-btn ${showHistory ? 'active' : ''}`}
              onClick={() => setShowHistory((v) => !v)}
              title="Query history"
            >
              <History size={20} strokeWidth={1.5} />
            </button>
          )}
          <div className="search-corner-tl" />
          <div className="search-corner-tr" />
          <div className="search-corner-bl" />
          <div className="search-corner-br" />
        </div>
        {showHistory && queryHistory.length > 0 && (
          <div className="search-history-dropdown">
            <div className="search-history-header">RECENT QUERIES</div>
            <ul className="search-history-list">
              {queryHistory.map((q, i) => (
                <li key={`${q}-${i}`}>
                  <button
                    type="button"
                    className="search-history-item"
                    onClick={() => handleSelectHistory(q)}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="filter-pills">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-pill ${selectedFilters.includes(filter.id) ? 'active' : ''}`}
            onClick={() => onFilterToggle(filter.id)}
          >
            <span>{filter.label}</span>
            <div className="pill-dot" />
          </button>
        ))}
      </div>
    </section>
  );
};
