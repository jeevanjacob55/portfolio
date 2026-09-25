import { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";

export default function Hero() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <section id="about" className="pt-40 pb-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-16 items-center">
        <div>
          <p className="text-mint text-sm mb-4">{profile.title}</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink mb-6">
            {profile.tagline}
          </h1>
          <div className="space-y-4 text-muted text-base leading-relaxed max-w-xl">
            {profile.bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-8">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink border border-hairline rounded-full px-4 py-2 hover:border-mint/50 hover:text-mint transition-colors"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink border border-hairline rounded-full px-4 py-2 hover:border-mint/50 hover:text-mint transition-colors"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 text-sm text-ink border border-hairline rounded-full px-4 py-2 hover:border-mint/50 hover:text-mint transition-colors"
            >
              <Mail size={16} /> Email
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
                alt={profile.name}
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
