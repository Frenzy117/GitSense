import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SearchResult } from '../types';

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onViewFile?: (path: string) => void;
}

function formatScore(score: number): string {
  const pct = Math.round(score * 100);
  return `${pct}%`;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  index,
  onViewFile
}) => {
  const scoreDisplay = typeof result.similarity === 'number'
    ? formatScore(result.similarity <= 1 ? result.similarity : result.similarity / 100)
    : `${result.similarity}%`;

  return (
    <article
      className="result-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="result-header-bar">
        <span className="result-path" title={result.path}>{result.path}</span>
        <div className="result-meta-badges">
          <span className="result-similarity">{scoreDisplay}</span>
          {result.language && <span className="result-badge">{result.language}</span>}
        </div>
      </div>

      <div className="result-meta-row">
        <span className="result-repo">{result.repo}</span>
        {(result.githubRepoUrl || result.githubFileUrl) && (
          <div className="result-github-links">
            {result.githubRepoUrl && (
              <a
                href={result.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="result-github-link"
              >
                <ExternalLink size={14} />
                Repo
              </a>
            )}
            {result.githubFileUrl && (
              <a
                href={result.githubFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="result-github-link"
              >
                <ExternalLink size={14} />
                File
              </a>
            )}
          </div>
        )}
      </div>

      <pre className="result-code">
        <code>{result.page_content || '(no preview)'}</code>
      </pre>

      <div className="result-footer">
        <div className="result-stats">
          {result.lines != null && (
            <>
              <span className="stat-item">{result.lines} LINES</span>
              <span className="stat-separator">·</span>
            </>
          )}
          <span className="stat-item">{result.repo}</span>
        </div>
        {(result.githubFileUrl || onViewFile) && (
          <button
            className="result-action"
            onClick={() =>
              result.githubFileUrl
                ? window.open(result.githubFileUrl, '_blank')
                : onViewFile?.(result.path)
            }
          >
            VIEW FILE
            <div className="action-arrow">→</div>
          </button>
        )}
      </div>
    </article>
  );
};
