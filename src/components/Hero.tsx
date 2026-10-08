import { ChevronDown } from "lucide-react";
import { heroContent } from "../data/heroContent";
import TypewriterText from "./TypewriterText";

export default function Hero() {
  return (
    <section id="home" className="hero-landing" aria-labelledby="hero-name">
      <div className="hero-landing__center">
        <h1 id="hero-name" className="hero-name">{heroContent.name}</h1>
        <TypewriterText />

        <div className="hero-actions">
          <a className="hero-action hero-action--primary" href="#projects">
            {heroContent.buttons.primary}
          </a>
          <a className="hero-action hero-action--secondary" href="#contact">
            {heroContent.buttons.secondary}
          </a>
        </div>
      </div>

      <a className="hero-scroll-cue" href="#experience" aria-label="Scroll to Experience section">
        <ChevronDown size={23} strokeWidth={1.7} aria-hidden="true" />
      </a>
    </section>
  );
}
