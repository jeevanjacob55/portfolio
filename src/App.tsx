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
