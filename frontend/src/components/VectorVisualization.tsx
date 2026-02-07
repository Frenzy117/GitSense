import React from 'react';

interface VectorVisualizationProps {
  dimensions?: number;
  gridSize?: number;
  activeCells?: number[];
  title?: string;
}

export const VectorVisualization: React.FC<VectorVisualizationProps> = ({
  dimensions = 1536,
  gridSize = 64,
  activeCells,
  title = 'VECTOR SPACE'
}) => {
  // Generate random active cells if not provided
  const cells = activeCells || Array.from({ length: gridSize }, (_, i) => 
    Math.random() > 0.5 ? i : -1
  ).filter(i => i !== -1);

  return (
    <div className="vector-viz">
      <div className="viz-header">
        <span className="viz-title">{title}</span>
        <span className="viz-dim">{dimensions}-D</span>
      </div>
      <div className="vector-grid">
        {Array.from({ length: gridSize }).map((_, i) => (
          <div
            key={i}
            className={`vector-cell ${cells.includes(i) ? 'active' : ''}`}
            style={{ animationDelay: `${i * 0.02}s` }}
          />
        ))}
      </div>
    </div>
  );
};
