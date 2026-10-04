import { useState } from "react";
import { ArrowDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { profile } from "../data/profile";
import { heroContent } from "../data/heroContent";
import TypewriterText from "./TypewriterText";

export default function Hero() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <section id="home" className="hero-landing" aria-labelledby="hero-name">
      <div className="hero-landing__layout">
        <div className="hero-landing__copy">
          <p className="hero-kicker"><span /> Software engineer · Full stack &amp; AI</p>
          <h1 id="hero-name" className="hero-name">{heroContent.name}</h1>
          <TypewriterText />
          <p className="hero-summary">{heroContent.summary}</p>

          <div className="hero-actions">
            <a className="hero-action hero-action--primary" href="#projects">
              {heroContent.buttons.primary}
            </a>
            <a className="hero-action hero-action--secondary" href="#contact">
              {heroContent.buttons.secondary}
            </a>
          </div>

          <div className="hero-proof" aria-label="Career highlights">
            <div><strong>100K+</strong><span>image export workflow</span></div>
            <div><strong>1 of 2</strong><span>AARIC platform developers</span></div>
            <div><strong>03</strong><span>featured projects</span></div>
          </div>

          <div className="hero-socials" aria-label="Social links">
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

        <div className="hero-portrait">
          <div className="hero-portrait__glow" aria-hidden="true" />
          <div className="hero-portrait__frame">
            {portraitFailed ? (
              <div className="portrait-fallback">Portrait unavailable</div>
            ) : (
              <img
                src={profile.portrait}
                alt={`Portrait of ${heroContent.name}`}
                className="hero-portrait__image"
                onError={() => setPortraitFailed(true)}
              />
            )}
            <div className="hero-portrait__caption">
              <MapPin size={15} aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </div>

      <a className="hero-scroll-cue" href="#experience" aria-label="Scroll to Experience section">
        <ArrowDown size={19} strokeWidth={1.6} aria-hidden="true" />
      </a>
    </section>
  );
}
