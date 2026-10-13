import { ArrowDownRight } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { profile } from "../data/portfolio";

export function About() {
  return (
    <section className="section page-wrap" id="about">
      <SectionTitle eyebrow="01 / ABOUT" title="Curiosity, code, and useful ideas." />
      <div className="about-grid">
        <p className="about-lead">
          I&apos;m a Computer Science engineer interested in building thoughtful applications with data and AI.
        </p>
        <div className="about-copy">
          <p>{profile.introduction}</p>
          <p>
            My interests span exploratory data analysis, machine learning, computer vision, generative AI, and backend
            development. I enjoy working through the full problem-solving process—from understanding a problem and
            preparing data to building an application around a model.
          </p>
          <a className="text-link" href="#projects">Explore selected work <ArrowDownRight size={15} /></a>
        </div>
      </div>
    </section>
  );
}