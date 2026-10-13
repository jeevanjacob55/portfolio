import { useEffect } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import CursorFollower from "./components/CursorFollower";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      ".site-content main > section[id]:not(#home)"
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target as HTMLElement;
          observer.unobserve(section);
          section.animate(
            [
              { opacity: 0, transform: "translateY(8px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 350,
              easing: "cubic-bezier(0, 0, 0.2, 1)",
              fill: "both",
            }
          );
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative isolate min-h-screen">
      <AnimatedBackground />
      <div className="site-grid" aria-hidden="true" />
      <CursorFollower />
      <Navbar />
      <div className="site-content">
        <main>
          <Hero />
          <Experience />
          <Projects />
          <About />
          <Education />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
