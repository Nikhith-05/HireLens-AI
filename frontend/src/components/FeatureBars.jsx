export default function FeatureBars({ scores = {} }) {
  const features = [
    { key: 'skill_score', label: 'Skills Match', icon: '🎯' },
    { key: 'experience_score', label: 'Experience', icon: '💼' },
    { key: 'education_score', label: 'Education', icon: '🎓' },
    { key: 'project_score', label: 'Projects', icon: '📁' },
    { key: 'certification_score', label: 'Certifications', icon: '📜' },
  ];

  const getBarClass = (value) => {
    if (value >= 0.7) return 'high';
    if (value >= 0.4) return 'medium';
    return 'low';
  };

  return (
    <div className="feature-bar-group">
      {features.map(({ key, label, icon }) => {
        const value = scores[key] ?? 0;
        const pct = Math.round(value * 100);
        return (
          <div key={key} className="feature-bar">
            <div className="feature-bar-header">
              <span className="feature-bar-label">{icon} {label}</span>
              <span className="feature-bar-value">{pct}%</span>
            </div>
            <div className="feature-bar-track">
              <div
                className={`feature-bar-fill ${getBarClass(value)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
