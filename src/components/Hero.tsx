import { useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { heroContent } from "../data/heroContent";
import TypewriterText from "./TypewriterText";

export default function Hero() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <>
      <section id="home" className="hero-landing" aria-labelledby="hero-name">
        <div className="hero-landing__center">
          <h1 id="hero-name" className="hero-name">{heroContent.name}</h1>
          <TypewriterText />
        </div>
        <a className="hero-scroll-cue" href="#about" aria-label="Scroll to About section">
          <ArrowDown size={19} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </section>

      <section id="about" className="hero-about px-6 sm:px-10" aria-labelledby="about-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="about-heading" className="font-display font-semibold text-3xl text-ink text-center mb-14">About</h2>
          <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-16 items-center">
          <div>
            <p className="text-muted text-base leading-relaxed mb-6">{heroContent.summary}</p>
            <div className="space-y-4 text-muted text-base leading-relaxed max-w-xl">
              {heroContent.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="flex items-center gap-5 mt-8">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="inline-flex items-center text-muted hover:text-ink transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex items-center text-muted hover:text-ink transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send email"
                className="inline-flex items-center text-muted hover:text-ink transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="relative mx-auto md:mx-0 w-full max-w-sm">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald/30 via-teal/10 to-transparent blur-2xl" />
            <div className="relative rounded-[1.75rem] overflow-hidden border border-hairline group">
              {portraitFailed ? (
                <div className="portrait-fallback">Add your portrait at /public/images/portrait.jpg</div>
              ) : (
                <img
                  src={profile.portrait}
                  alt={heroContent.name}
                  className="w-full aspect-[4/5] object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                  onError={() => setPortraitFailed(true)}
                />
              )}
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
