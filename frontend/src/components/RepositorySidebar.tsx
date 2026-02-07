import React from 'react';
import { Repository } from '../types';

interface RepositorySidebarProps {
  repositories: Repository[];
  activeRepo: string;
  onRepoSelect: (repoName: string) => void;
  title?: string;
}

export const RepositorySidebar: React.FC<RepositorySidebarProps> = ({
  repositories,
  activeRepo,
  onRepoSelect,
  title = 'ACTIVE REPOS'
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">{title}</h3>
        <div className="blink-dot" />
      </div>

      <div className="repo-list">
        {repositories.map((repo, i) => (
          <div
            key={repo.name}
            className={`repo-card ${activeRepo === repo.name ? 'active' : ''}`}
            onClick={() => onRepoSelect(repo.name)}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="repo-header">
              <span className="repo-name">{repo.name}</span>
              <div className="repo-indicator" />
            </div>
            <div className="repo-meta">
              <span className="repo-stat">{repo.files} FILES</span>
              <span className="repo-separator">·</span>
              <span className="repo-stat">{repo.vectors} VEC</span>
            </div>
            <div className="repo-footer">
              <span className="repo-language">{repo.language}</span>
              <span className="repo-updated">{repo.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
