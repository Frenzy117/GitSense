import React from 'react';
import { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
  index: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, index }) => {
  return (
    <div
      className="metric-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="metric-label">{metric.label.toUpperCase()}</div>
      <div className="metric-value">
        {(metric.value * 100).toFixed(1)}
      </div>
      <div className="metric-bar">
        <div
          className="metric-bar-fill"
          style={{ width: `${metric.value * 100}%` }}
        />
      </div>
    </div>
  );
};
