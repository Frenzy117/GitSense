import React, { useRef, useEffect } from 'react';

interface DotMatrixCanvasProps {
  dotSpacing?: number;
  dotRadius?: number;
  opacity?: number;
}

export const DotMatrixCanvas: React.FC<DotMatrixCanvasProps> = ({
  dotSpacing = 40,
  dotRadius = 1.5,
  opacity = 0.12
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawDots = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          const currentOpacity = opacity + Math.random() * 0.05;
          ctx.globalAlpha = currentOpacity;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    drawDots();

    const handleResize = () => {
      drawDots();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dotSpacing, dotRadius, opacity]);

  return <canvas ref={canvasRef} className="dot-canvas" />;
};
