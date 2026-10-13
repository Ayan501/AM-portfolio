import { ArrowUpRight } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { AskAyanAI } from "./components/AskAyanAI";
import { navigation, profile } from "./data/portfolio";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { Education } from "./sections/Education";
import { Certificates } from "./sections/Certificates";
import { Contact } from "./sections/Contact";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certificates />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <a className="brand-mark footer-brand" href="#home">{profile.initials}<span>.</span></a>
          <div><strong>{profile.name}</strong><p>Building practical systems with data and AI.</p></div>
          <div className="footer-links">
            {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
            <a href={`mailto:${profile.email}`}>Email <ArrowUpRight size={13} /></a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Ayan Mansoori</p>
        </div>
      </footer>
      <AskAyanAI />
    </>
  );
}