import { GraduationCap } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { education } from "../data/portfolio";

export function Education() {
  return (
    <section className="section education-section" id="education">
      <div className="page-wrap">
        <SectionTitle eyebrow="05 / EDUCATION" title="Foundations in computer science." />
        <div className="education-list">
          {education.map((item) => (
            <article className="education-card" key={item.level}>
              <div className="education-icon"><GraduationCap size={22} /></div>
              <div className="education-content">
                <p className="eyebrow">{item.level}</p>
                <h3>{item.institution}</h3>
                {item.detail && <p>{item.detail}</p>}
                {(item.result || item.year) && (
                  <span className="education-meta">
                    {item.result}{item.result && item.year ? " · " : ""}{item.year}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}