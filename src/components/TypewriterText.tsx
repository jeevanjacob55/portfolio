import { useEffect, useState } from "react";
import { heroContent } from "../data/heroContent";

const TYPE_DELAY = 78;
const DELETE_DELAY = 38;
const SENTENCE_PAUSE = 1800;
const TRANSITION_PAUSE = 360;

export default function TypewriterText() {
  const roles = heroContent.roles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (roles.length === 0 || reducedMotion) return;

    const role = roles[roleIndex % roles.length];
    let delay: number;
    let action: () => void;

    if (!deleting && characterCount < role.length) {
      delay = TYPE_DELAY;
      action = () => setCharacterCount((count) => count + 1);
    } else if (!deleting) {
      delay = SENTENCE_PAUSE;
      action = () => setDeleting(true);
    } else if (characterCount > 0) {
      delay = DELETE_DELAY;
      action = () => setCharacterCount((count) => count - 1);
    } else {
      delay = TRANSITION_PAUSE;
      action = () => {
        setRoleIndex((index) => (index + 1) % roles.length);
        setDeleting(false);
      };
    }

    const timer = window.setTimeout(action, delay);
    return () => window.clearTimeout(timer);
  }, [characterCount, deleting, reducedMotion, roleIndex, roles]);

  if (roles.length === 0) return null;

  const role = roles[roleIndex % roles.length];
  const displayedText = reducedMotion ? role : role.slice(0, characterCount);
  const longestRole = roles.reduce((longest, current) =>
    current.length > longest.length ? current : longest
  );

  return (
    <div className="typewriter" aria-label="Introduction">
      <span className="typewriter__reserve" aria-hidden="true">{longestRole}</span>
      <span className="typewriter__visual" aria-hidden="true">
        {displayedText}
        {!reducedMotion && <span className="typewriter__cursor" />}
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{role}</span>
    </div>
  );
}
