import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { profile } from "../data/profile";
import { heroContent } from "../data/heroContent";

const links = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const linksRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, width: 0, visible: false });

  const moveIndicator = (link: HTMLAnchorElement) => {
    const item = link.parentElement;
    if (!item) return;
    setIndicator({ x: item.offsetLeft, width: link.offsetWidth, visible: true });
  };

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const currentLink = linksRef.current?.querySelector<HTMLAnchorElement>("a.is-active");
      if (currentLink) moveIndicator(currentLink);
      else setIndicator((current) => ({ ...current, visible: false }));
    };
    const frame = window.requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [active]);

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
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}>
      <nav className="navbar-shell">
        <a href="#home" className="navbar-logo">
          Portfolio
        </a>

        <ul
          ref={linksRef}
          className="navbar-links hidden md:flex"
          onMouseLeave={() => {
            const currentLink = linksRef.current?.querySelector<HTMLAnchorElement>("a.is-active");
            if (currentLink) moveIndicator(currentLink);
            else setIndicator((current) => ({ ...current, visible: false }));
          }}
        >
          <span
            className="navbar-indicator"
            aria-hidden="true"
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.x}px)`,
              opacity: indicator.visible ? 1 : 0,
            }}
          />
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`navbar-link ${
                  active === l.id
                    ? "is-active"
                    : ""
                }`}
                onMouseEnter={(event) => moveIndicator(event.currentTarget)}
                onFocus={(event) => moveIndicator(event.currentTarget)}
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
          {heroContent.buttons.resume}
          <Download size={14} strokeWidth={1.6} />
        </a>

        <button
          className="navbar-menu-button md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
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
          <Download size={14} strokeWidth={1.6} />
          {heroContent.buttons.resume}
        </a>
      </div>
    </header>
  );
}
