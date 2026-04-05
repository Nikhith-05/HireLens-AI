export default function SkillTags({ skills = [], type = 'matched' }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="skill-tags">
      {skills.map((skill, index) => (
        <span key={index} className={`skill-tag ${type}`}>
          {type === 'matched' ? '✓' : '✗'} {skill}
        </span>
      ))}
    </div>
  );
}
