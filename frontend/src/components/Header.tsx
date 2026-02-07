import React from 'react';
import { HeaderStat } from '../types';

interface HeaderProps {
  stats: HeaderStat[];
  appName?: string;
  appSubtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  appName = 'GITSENSE',
  appSubtitle = 'SEMANTIC CODE INTELLIGENCE'
}) => {
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
        {stats.map((stat, i) => (
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
