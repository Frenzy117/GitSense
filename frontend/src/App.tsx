import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DotMatrixCanvas,
  Header,
  SearchBar,
  RepositorySidebar,
  ResultsList,
  MetricsPanel
} from './components';
import { useSearch, useRepository } from './hooks';
import {
  mockRepositories,
  mockMetrics,
  mockFilters,
  mockHeaderStats,
  mockQueryTokens
} from './utils/mockData';
import { getGithubRepoUrl, getGithubFileUrl } from './utils/github';
import './styles/globals.css';
import { SearchResult } from './types';
import {
  setSearchResults,
  setLoading,
  addToQueryHistory,
  setLastQuery
} from './store/searchSlice';
import type { RootState } from './store';

function mapApiResultToSearchResult(result: {
  metadata: Record<string, unknown>;
  score: number;
  text?: string;
}): SearchResult {
  const meta = result.metadata || {};
  const path = (meta.path as string) || '';
  const repoId = (meta.repo_id as string) || (meta.repo as string) || '';
  const repo = repoId || (meta.repo as string) || '';

  return {
    path,
    similarity: result.score ?? 0,
    preview: result.text ?? '',
    page_content: meta.text as string,
    language: meta.language as string | undefined,
    lines: meta.lines as number | undefined,
    repo,
    repoId: repoId || undefined,
    githubRepoUrl: repoId ? getGithubRepoUrl(repoId) : undefined,
    githubFileUrl: repoId && path ? getGithubFileUrl(repoId, path) : undefined
  };
}

const GitSenseApp: React.FC = () => {
  const dispatch = useDispatch();
  const { results: searchResults, queryHistory } = useSelector((s: RootState) => s.search);
  const { query, selectedFilters, handleQueryChange, toggleFilter } = useSearch('');
  const { activeRepo, selectRepo } = useRepository('backend-api');

  const handleViewFile = (path: string) => {
    console.log('Viewing file:', path);
  };

  const processQuery = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    dispatch(setLoading(true));
    dispatch(setLastQuery(trimmed));

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed })
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      const mapped: SearchResult[] = (data.results || []).map(mapApiResultToSearchResult);
      dispatch(setSearchResults(mapped));
      dispatch(addToQueryHistory(trimmed));
    } catch (error) {
      console.error('Error processing query:', error);
      dispatch(setSearchResults([]));
    }
  };

  const handleSelectHistory = (q: string) => {
    handleQueryChange(q);
    processQuery(q);
  };

  return (
    <div className="gitsense-container">
      <DotMatrixCanvas />
      <Header stats={mockHeaderStats} />
      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        filters={mockFilters}
        selectedFilters={selectedFilters}
        onFilterToggle={toggleFilter}
        queryHistory={queryHistory}
        onSelectHistory={handleSelectHistory}
        onSubmit={() => processQuery(query)}
      />
      <div className="main-grid">
        <RepositorySidebar
          repositories={mockRepositories}
          activeRepo={activeRepo}
          onRepoSelect={selectRepo}
        />
        <ResultsList
          results={searchResults}
          onViewFile={handleViewFile}
        />
        <MetricsPanel
          metrics={mockMetrics}
          queryTokens={mockQueryTokens}
        />
      </div>
    </div>
  );
};

export default GitSenseApp;
