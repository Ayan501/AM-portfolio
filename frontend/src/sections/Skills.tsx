import { SectionTitle } from "../components/SectionTitle";
import { SkillCard } from "../components/SkillCard";
import { skillGroups } from "../data/portfolio";

export function Skills() {
  return (
    <section className="section section-tint" id="skills">
      <div className="page-wrap">
        <SectionTitle
          eyebrow="02 / SKILLS"
          title="A toolkit for turning ideas into systems."
          description="Technologies across data, machine learning, and application development. Tap or hover a card to see estimated skill levels."
        />
        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <SkillCard key={group.name} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}