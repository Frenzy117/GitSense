import React from 'react';
import { SearchResult } from '../types';
import { ResultCard } from './ResultCard';

interface ResultsListProps {
  results: SearchResult[];
  title?: string;
  onViewFile?: (path: string) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  title = 'SEARCH RESULTS',
  onViewFile
}) => {
  return (
    <main className="results-main">
      <div className="results-header">
        <div className="results-title-section">
          <h2 className="results-title">{title}</h2>
          <div className="results-divider" />
          <div className="results-count">
            <span className="count-number">{results.length}</span>
            <span className="count-label">MATCHES</span>
            {/* <span className="count-separator">·</span> */}
            {/* <span className="count-time">0.23s</span> */}
          </div>
        </div>
      </div>

      <div className="results-list">
        {results.map((result, i) => (
          <ResultCard
            key={i}
            result={result}
            index={i}
            onViewFile={onViewFile}
          />
        ))}
      </div>
    </main>
  );
};
