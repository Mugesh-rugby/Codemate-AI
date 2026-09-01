function getConfidenceLevel(accuracy) {
  if (accuracy >= 90) return { label: "Highly Confident", color: "#34d399" };
  if (accuracy >= 75) return { label: "Mostly Confident", color: "#818cf8" };
  if (accuracy >= 50) return { label: "Moderate Confidence", color: "#fbbf24" };
  return { label: "Low Confidence", color: "#f87171" };
}

export default function AccuracyCard({ accuracy, reason }) {
  const level = getConfidenceLevel(accuracy);

  return (
    <div className="accuracy-wrap">
      <div className="accuracy-top">
        <span className="accuracy-value">{accuracy}%</span>
        <span
          className="accuracy-badge"
          style={{ color: level.color, background: `${level.color}1a` }}
        >
          {level.label}
        </span>
      </div>
      <div className="accuracy-track">
        <div
          className="accuracy-fill"
          style={{ width: `${accuracy}%`, background: level.color }}
        />
      </div>
      <p className="accuracy-caption">AI Estimated Accuracy — not a formal verification</p>
      {reason && <p className="accuracy-reason">{reason}</p>}
    </div>
  );
}
