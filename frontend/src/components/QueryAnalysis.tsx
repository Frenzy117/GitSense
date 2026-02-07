import React from 'react';

interface QueryAnalysisProps {
  tokens: string[];
  title?: string;
}

export const QueryAnalysis: React.FC<QueryAnalysisProps> = ({
  tokens,
  title = 'QUERY TOKENS'
}) => {
  return (
    <div className="query-analysis">
      <div className="analysis-header">{title}</div>
      <div className="analysis-tags">
        {tokens.map((token, i) => (
          <span key={i} className="analysis-tag">
            {token.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};
