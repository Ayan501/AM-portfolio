import { useState, type FormEvent } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { profile } from "../data/portfolio";
import { sendContact } from "../services/api";
import { SectionTitle } from "../components/SectionTitle";

type FormState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setMessage("");
    try {
      await sendContact({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message") || ""),
        website: String(data.get("website") || ""),
      });
      setState("sent");
      setMessage("Your message was accepted for delivery. Thank you for reaching out.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="page-wrap">
        <SectionTitle
          eyebrow="07 / CONTACT"
          title="Have a thoughtful problem in mind?"
          description="For opportunities, collaborations, or a conversation about applied AI and machine learning."
        />
        <div className="contact-grid">
          <div className="contact-details">
            <a href={`mailto:${profile.email}`} className="contact-link"><Mail size={17} /><span>{profile.email}</span><ArrowUpRight size={15} /></a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="contact-link"><Github size={17} /><span>GitHub</span><ArrowUpRight size={15} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-link"><Linkedin size={17} /><span>LinkedIn</span><ArrowUpRight size={15} /></a>
            <div className="contact-link"><MapPin size={17} /><span>{profile.location}</span></div>
            <p className="contact-fallback">Prefer email? Write directly to <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Name<input name="name" autoComplete="name" maxLength={100} required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
            </div>
            <label>Subject<input name="subject" maxLength={150} required /></label>
            <label>Message<textarea name="message" rows={5} maxLength={4000} required /></label>
            <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="form-footer">
              <button className="button" type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send message"} <ArrowUpRight size={16} />
              </button>
              <span>Messages are sent only when email delivery is configured.</span>
            </div>
            {message && <p className={`form-feedback ${state}`} role={state === "error" ? "alert" : "status"}>{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}