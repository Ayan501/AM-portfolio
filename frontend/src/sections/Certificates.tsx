import { ArrowUpRight, Award } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { certificates } from "../data/portfolio";

export function Certificates() {
  return (
    <section className="section certificate-section" id="certificates">
      <div className="page-wrap">
        <SectionTitle eyebrow="06 / CERTIFICATES" title="Learning through data science." />
        {certificates.length ? (
          <div className="certificate-grid">
            {certificates.map((certificate) => (
              <article className="certificate-card" key={certificate.title}>
                <Award size={20} />
                <h3>{certificate.title}</h3>
                <p>{certificate.organization}{certificate.date ? ` · ${certificate.date}` : ""}</p>
                {certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">View credential <ArrowUpRight size={14} /></a>}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><Award size={20} /><p>Certificates will be added here once verified credentials are available.</p></div>
        )}
      </div>
    </section>
  );
}