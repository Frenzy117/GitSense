import React from 'react';
import { Metric } from '../types';
import { MetricCard } from './MetricCard';
import { VectorVisualization } from './VectorVisualization';
import { QueryAnalysis } from './QueryAnalysis';

interface MetricsPanelProps {
  metrics: Metric[];
  queryTokens: string[];
  title?: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  queryTokens,
  title = 'SEARCH QUALITY METRICS'
}) => {
  return (
    <aside className="metrics-panel">
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <div className="panel-line" />
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, i) => (
          <MetricCard key={i} metric={metric} index={i} />
        ))}
      </div>

      <VectorVisualization />
      
      <QueryAnalysis tokens={queryTokens} />
    </aside>
  );
};
