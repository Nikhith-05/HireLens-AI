export default function ExplanationPanel({ explanation = {} }) {
  const { summary, strengths, weaknesses, feature_contributions } = explanation;

  return (
    <div className="explanation-panel">
      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '1rem', lineHeight: 1.7, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {summary}
        </div>
      )}

      {/* Feature Contributions */}
      {feature_contributions && Object.keys(feature_contributions).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Factor Analysis
          </div>
          {Object.entries(feature_contributions).map(([key, contrib]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0', fontSize: '0.85rem',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{key}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  color: contrib.impact === 'positive' ? 'var(--success)' : 'var(--danger)',
                  fontWeight: 600,
                }}>
                  {contrib.impact === 'positive' ? '↑' : '↓'} {Math.round(contrib.score * 100)}%
                </span>
                <span style={{
                  color: 'var(--text-muted)', fontSize: '0.75rem',
                }}>
                  (w: {contrib.weight})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {strengths?.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          {strengths.map((s, i) => (
            <div key={i} className="explanation-item positive">
              <span className="explanation-icon">✓</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses?.length > 0 && (
        <div>
          {weaknesses.map((w, i) => (
            <div key={i} className="explanation-item negative">
              <span className="explanation-icon">✗</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {!summary && !strengths?.length && !weaknesses?.length && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
          No explanation available
        </div>
      )}
    </div>
  );
}
