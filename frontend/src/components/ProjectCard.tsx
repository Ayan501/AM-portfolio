import { useState } from "react";
import { ArrowUpRight, ChevronDown, Github, X } from "lucide-react";
import type { CSSProperties } from "react";
import type { PortfolioProject } from "../types";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = `project-details-${index}-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <article className={`project-card${expanded ? " is-expanded" : ""}`} style={{ "--card-index": index } as CSSProperties}>
      <div className="project-card-front">
        <div className="project-card-top">
          <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="project-category">{project.category}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-tags">
          {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <div className="project-actions">
          <button
            type="button"
            className="text-action"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Close project" : "Explore project"}
            <ChevronDown size={15} className={expanded ? "rotated" : ""} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id={detailsId} className="project-details" aria-hidden={!expanded}>
        <div className="project-details-heading">
          <div>
            <span className="project-details-label">{project.category}</span>
            <h3>{project.title}</h3>
          </div>
          <button
            className="project-details-close"
            type="button"
            aria-label={`Close ${project.title} details`}
            onClick={() => setExpanded(false)}
          >
            <X size={17} />
          </button>
        </div>
        <div className="project-details-content">
          <div>
            <strong>Technologies</strong>
            <div className="project-tags">
              {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
          </div>
          <div><strong>The problem</strong><p>{project.problem}</p></div>
          <div><strong>Approach</strong><p>{project.approach}</p></div>
        </div>
        {(project.repositoryUrl || project.demoUrl) && (
          <div className="project-detail-links">
            {project.repositoryUrl && (
              <a className="icon-action" href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} repository`}>
                <Github size={17} />
              </a>
            )}
            {project.demoUrl && (
              <a className="icon-action" href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} demo`}>
                <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}