import { BriefcaseBusiness } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { experiences } from "../data/portfolio";

export function Experience() {
  return (
    <section className="section page-wrap" id="experience">
      <SectionTitle
        eyebrow="03 / EXPERIENCE"
        title="Experience in progress."
        description="Professional experience, shared with care for accuracy."
      />
      <div className="experience-list">
        {experiences.map((experience) => (
          <article className="experience-item" key={experience.organization}>
            <div className="experience-icon"><BriefcaseBusiness size={19} /></div>
            <div className="experience-content">
              <div className="experience-heading">
                <div><p className="eyebrow">{experience.type}</p><h3>{experience.title}</h3></div>
                <span>{experience.organization}</span>
              </div>
              <p>{experience.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}