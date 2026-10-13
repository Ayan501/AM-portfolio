import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { SkillGroup } from "../types";

export function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = `skill-details-${index}`;

  return (
    <article className={`skill-card${expanded ? " is-expanded" : ""}`}>
      <div className="skill-card-front">
        <div className="skill-card-heading">
          <span>0{index + 1}</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </div>
        <h3>{group.name}</h3>
        <ul>{group.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}</ul>
        <button
          className="skill-card-trigger"
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Close skill levels" : "View skill levels"}
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>
      <div id={detailsId} className="skill-card-details" aria-hidden={!expanded}>
        <div className="skill-details-heading">
          <div>
            <span className="skill-level-caption">ESTIMATED LEVELS</span>
            <h4>{group.name}</h4>
          </div>
          <button
            className="skill-details-close"
            type="button"
            aria-label={`Close ${group.name} skill levels`}
            onClick={() => setExpanded(false)}
          >
            <X size={17} />
          </button>
        </div>
        <ul className="skill-level-list">
          {group.skills.map((skill) => (
            <li key={skill.name}>
              <span>{skill.name}</span>
              <strong>{skill.level}</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
