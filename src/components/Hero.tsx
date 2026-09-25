import { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { heroContent } from "../data/heroContent";
import TypewriterText from "./TypewriterText";

export default function Hero() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <section id="about" className="pt-40 pb-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-16 items-center">
        <div>
          <div className="mb-8 text-center">
            <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-[1.1] text-white mb-3">
              {heroContent.name}
            </h1>
            <TypewriterText />
            <p className="text-muted text-sm sm:text-base leading-relaxed mt-4 max-w-xl mx-auto">
              {heroContent.summary}
            </p>
          </div>
          <div className="space-y-4 text-muted text-base leading-relaxed max-w-xl">
            {heroContent.bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 text-sm text-[#030712] bg-sky-300 border border-sky-300 rounded-full px-4 py-2 hover:bg-sky-200 transition-colors"
            >
              {heroContent.buttons.primary}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm text-ink border border-hairline rounded-full px-4 py-2 hover:border-sky-300/50 hover:text-sky-200 transition-colors"
            >
              {heroContent.buttons.secondary}
            </a>
          </div>

          <div className="flex items-center gap-4 mt-5">
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
    </section>
  );
}
