import { Link2 } from "lucide-react";

export default function ReferenceList({ references }) {
  if (!references || references.length === 0) {
    return <p className="no-reference">No verified reference available.</p>;
  }

  return (
    <div className="reference-list">
      {references.map((ref, i) => (
        <a
          key={i}
          className="reference-link"
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={13} />
          {ref.title}
        </a>
      ))}
    </div>
  );
}
