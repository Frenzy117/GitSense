import React, { useState, useEffect } from 'react';
import { HeaderStat, StatsType } from '../types';

interface HeaderProps {
  stats: HeaderStat[];
  appName?: string;
  appSubtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  // stats,
  appName = 'GITSENSE',
  appSubtitle = 'SEMANTIC CODE INTELLIGENCE'
}) => {

  const [statsResult, setStatsResult] = useState<StatsType>({
    vectorCount: 0,
    dimension: 0,
    metric: '',
    vectorType: ''
  });

  const [displayStats, setDisplayStats] = useState<HeaderStat[]>([])

  const getIndexStats = async () => {

    try {
      const response = await fetch('http://localhost:8000/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      
      const results: StatsType = {
        vectorCount: 0,
        dimension: 0,
        metric: '',
        vectorType: '',
        ...(data ?? {})
      };
      const stats: HeaderStat[] = [
        { label: 'Vector Type', value: results.vectorType },
        { label: 'Vector Count', value: String(results.vectorCount) },
        { label: 'Dimension', value: String(results.dimension) },
        { label: 'Metric', value: results.metric },
      ];
      setStatsResult(results);
      setDisplayStats(stats);
    } catch (error) {
      console.error('Error processing query:', error);
    }
  };

  useEffect(() => {
    getIndexStats();
  }, []);

  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo-icon">
          <div className="dot-grid-small">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="mini-dot" />
            ))}
          </div>
        </div>
        <div className="logo-text-wrapper">
          <h1 className="logo-text">{appName}</h1>
          <div className="logo-subtitle">{appSubtitle}</div>
        </div>
      </div>

      <div className="header-metrics">
        {displayStats.map((stat, i) => (
          <div key={i} className="header-stat" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-border" />
          </div>
        ))}
      </div>
    </header>
  );
};
