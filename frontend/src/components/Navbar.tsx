import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { profile, navigation } from "../data/portfolio";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = ["home", ...navigation.map((item) => item.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand-mark" href="#home" aria-label="Ayan Mansoori home" onClick={closeMenu}>
          {profile.initials}<span>.</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`nav-content${menuOpen ? " is-open" : ""}`}>
          <div className="nav-links">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={active === item.href.slice(1) ? "active" : ""}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-socials" aria-label="Social and email links">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={15} /></a>
          </div>
          <a className="button button-small nav-cta" href="#contact" onClick={closeMenu}>
            Let&apos;s talk <ArrowUpRight size={14} />
          </a>
        </div>
      </nav>
    </header>
  );
}