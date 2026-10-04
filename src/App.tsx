import { useEffect } from "react";
import CursorFollower from "./components/CursorFollower";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]:not(#home)")
    );
    if (sections.length === 0) return;

    document.documentElement.classList.add("has-scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-scroll-reveal");
      sections.forEach((section) => section.classList.remove("is-revealed"));
    };
  }, []);

  return (
    <div className="relative isolate min-h-screen">
      <div className="site-grid" aria-hidden="true" />
      <CursorFollower />
      <Navbar />
      <div className="site-content">
        <main>
          <Hero />
          <Experience />
          <Education />
          <Projects />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
