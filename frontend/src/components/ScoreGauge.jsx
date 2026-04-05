import { useEffect, useState } from 'react';

export default function ScoreGauge({ score = 0, size = 140, label = 'Match Score' }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="score-gauge">
      <div className="gauge-circle" style={{ width: size, height: size }}>
        <svg className="gauge-svg" width={size} height={size}>
          <circle
            className="gauge-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          <circle
            className="gauge-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${getColor()}40)` }}
          />
        </svg>
        <div className="gauge-value">
          <div className="gauge-number" style={{ color: getColor(), fontSize: size * 0.15 }}>
            {Math.round(animated)}%
          </div>
          <div className="gauge-label" style={{ fontSize: size * 0.05 }}>{label}</div>
        </div>
      </div>
    </div>
  );
}
