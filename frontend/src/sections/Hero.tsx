import { useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Mail } from "lucide-react";
import { profile } from "../data/portfolio";
import { NeuralVisual } from "../components/NeuralVisual";

export function Hero() {
  const [hasPhoto, setHasPhoto] = useState(true);
  const [resumeMessage, setResumeMessage] = useState("");

  async function downloadResume() {
    setResumeMessage("");
    try {
      const response = await fetch(profile.resume, { method: "HEAD" });
      if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) {
        throw new Error("Resume is not available yet.");
      }
      const link = document.createElement("a");
      link.href = profile.resume;
      link.download = "Ayan-Mansoori-Resume.pdf";
      link.click();
    } catch {
      setResumeMessage("Add your resume as frontend/public/resume.pdf to enable downloads.");
    }
  }

  return (
    <section className="hero-section page-wrap" id="home">
      <div className="hero-copy">
        <div className="availability"><span /> Computer Science · AI &amp; Machine Learning</div>
        <p className="hero-overline">HELLO, I&apos;M</p>
        <h1>{profile.name}<span className="name-period">.</span></h1>
        <p className="hero-title">{profile.title}</p>
        <h2>{profile.headline}</h2>
        <p className="hero-intro">{profile.introduction}</p>
        <div className="hero-actions">
          <a className="button" href="#contact">Contact me <ArrowUpRight size={16} /></a>
          <button className="button button-outline" type="button" onClick={downloadResume}>
            Download resume <ArrowDownToLine size={16} />
          </button>
        </div>
        {resumeMessage && <p className="inline-notice" role="status">{resumeMessage}</p>}
        <div className="hero-socials">
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
          <a href={`mailto:${profile.email}`}><Mail size={13} /> Email</a>
        </div>
      </div>
      <div className="hero-art">
        <div className="portrait-frame">
          {hasPhoto ? (
            <img
              src={profile.image}
              alt="Portrait of Ayan Mansoori"
              onError={() => setHasPhoto(false)}
            />
          ) : (
            <div className="portrait-placeholder" role="img" aria-label="Portrait placeholder for Ayan Mansoori">
              <span>AM</span>
              <strong>{profile.name}</strong>
              <small>Portrait placeholder</small>
              <small className="portrait-placeholder-path">ADD PUBLIC/IMAGES/PROFILE.JPG</small>
            </div>
          )}
          {hasPhoto && <span className="portrait-index">PROFILE · 2026</span>}
        </div>
        <NeuralVisual />
      </div>
      <a className="scroll-cue" href="#about"><span /> Scroll to explore</a>
    </section>
  );
}