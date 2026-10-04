import { useEffect, useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { profile } from "../data/profile";
import { heroContent } from "../data/heroContent";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

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
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <nav className="navbar-shell">
        <a href="#home" className="navbar-logo">
          {heroContent.name.split(" ")[0]}
        </a>

        <ul className="navbar-links hidden md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`navbar-link ${
                  active === l.id
                    ? "is-active"
                    : ""
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.social.resume}
          className="navbar-resume hidden md:inline-flex items-center gap-1.5"
        >
          <FileText size={14} />
          {heroContent.buttons.resume}
        </a>

        <button
          className="navbar-menu-button md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div id="mobile-menu" aria-hidden={!open} className={`mobile-menu${open ? " is-open" : ""}`}>
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className={`mobile-menu__link ${active === l.id ? "is-active" : ""}`}
          >
            {l.label}
          </a>
        ))}
        <a
          href={profile.social.resume}
          tabIndex={open ? 0 : -1}
          className="mobile-menu__link mobile-menu__resume"
        >
          <FileText size={14} />
          {heroContent.buttons.resume}
        </a>
      </div>
    </header>
  );
}
