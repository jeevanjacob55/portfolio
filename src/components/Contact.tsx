import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { profile } from "../data/profile";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 sm:px-10">
      <div className="max-w-3xl mx-auto">
        <SectionHeading index="06" title="Get in touch" />
        <div className="mx-auto max-w-md">
          <p className="text-muted leading-relaxed mb-8 text-center">
            Open to full-stack and backend engineering roles, freelance work, and interesting
            problems. Reach out and I'll get back to you.
          </p>

          <div className="space-y-3.5 text-sm">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted hover:text-ink transition-colors">
              <Mail size={16} /> {profile.email}
            </a>
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-ink transition-colors">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={profile.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-ink transition-colors">
              <Github size={16} /> GitHub
            </a>
            <p className="flex items-center gap-3 text-muted">
              <MapPin size={16} /> {profile.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
