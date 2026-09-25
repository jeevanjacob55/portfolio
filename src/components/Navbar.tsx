import { useEffect, useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { profile } from "../data/profile";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="w-full max-w-3xl rounded-full border border-hairline bg-white/5 backdrop-blur-xl
                   px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_0_40px_-10px_rgba(13,148,136,0.35)]"
      >
        <a href="#about" className="font-display text-lg tracking-tight text-ink shrink-0">
          {profile.name.split(" ")[0]}
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors duration-200 ${
                  active === l.id
                    ? "text-ink bg-white/10"
                    : "text-muted hover:text-ink hover:bg-white/5"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.social.resume}
          className="hidden md:inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full
                     border border-hairline text-ink hover:border-mint/50 hover:text-mint transition-colors"
        >
          <FileText size={14} />
          Resume
        </a>

        <button
          className="md:hidden text-ink"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden absolute top-16 left-4 right-4 rounded-2xl border border-hairline bg-[#09090B]/95 backdrop-blur-xl p-3 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm ${
                active === l.id ? "text-ink bg-white/10" : "text-muted"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={profile.social.resume}
            className="px-3 py-2.5 rounded-lg text-sm text-mint flex items-center gap-1.5"
          >
            <FileText size={14} />
            Resume
          </a>
        </div>
      )}
    </header>
  );
}
