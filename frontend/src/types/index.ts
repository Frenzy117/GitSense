// Type definitions for GitSense application

export interface Repository {
  name: string;
  files: string;
  updated: string;
  language: string;
  vectors: number;
}

export interface SearchResult {
  path: string;
  similarity: number;
  preview: string;
  /** Raw text from API (alias for preview) */
  page_content?: string;
  language?: string;
  lines?: number;
  repo: string;
  /** GitHub repo identifier (owner/repo) for building links */
  repoId?: string;
  /** GitHub URL to the repository */
  githubRepoUrl?: string;
  /** GitHub URL to the specific file (blob) */
  githubFileUrl?: string;
}

export interface Metric {
  label: string;
  value: number;
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface HeaderStat {
  value: string;
  label: string;
}
