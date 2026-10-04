import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { heroContent } from "../data/heroContent";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="hero-about px-6 sm:px-10" aria-labelledby="about-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeading index="03" title="About" id="about-heading" />
        <div className="about-copy">
          <div className="about-bio">
            {heroContent.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <div className="about-socials" aria-label="Social links">
            <a href={profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <Github size={18} />
            </a>
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Send email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
