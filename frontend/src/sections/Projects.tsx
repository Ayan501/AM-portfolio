import { useMemo, useState } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { ProjectCard } from "../components/ProjectCard";
import { majorProjects, practiceProjects, projectCategories } from "../data/portfolio";

export function Projects() {
  const [category, setCategory] = useState<(typeof projectCategories)[number]>("All");
  const visibleMajorProjects = useMemo(
    () => category === "All" ? majorProjects : majorProjects.filter((project) => project.category === category),
    [category],
  );
  const visiblePracticeProjects = useMemo(
    () => category === "All" ? practiceProjects : practiceProjects.filter((project) => project.category === category),
    [category],
  );

  return (
    <section className="section section-tint" id="projects">
      <div className="page-wrap">
        <SectionTitle
          eyebrow="04 / SELECTED WORK"
          title="Projects, from practice to production."
          description="Explore my major projects and hands-on practice projects. Use the category filters to find work by discipline."
        />
        <div className="project-filters" aria-label="Filter projects by category">
          {projectCategories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "filter-chip active" : "filter-chip"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {visibleMajorProjects.length > 0 && (
          <section className="project-group" aria-labelledby="major-projects-heading">
            <div className="project-group-heading">
              <h3 id="major-projects-heading">Major Projects</h3>
              <span>
                {visibleMajorProjects.length} {visibleMajorProjects.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <div className="projects-grid" aria-live="polite">
              {visibleMajorProjects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
        {visiblePracticeProjects.length > 0 && (
          <section className="project-group" aria-labelledby="practice-projects-heading">
            <div className="project-group-heading">
              <h3 id="practice-projects-heading">Practice Projects</h3>
              <span>
                {visiblePracticeProjects.length} {visiblePracticeProjects.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <div className="projects-grid" aria-live="polite">
              {visiblePracticeProjects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}