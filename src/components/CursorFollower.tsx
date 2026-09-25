import { useEffect, useRef, useState } from "react";

const CURSOR_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia(CURSOR_QUERY);
    const updatePreference = () => setEnabled(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!enabled || !cursor) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastFrameTime = 0;
    let frameId = 0;
    let visible = false;

    const placeCursor = (x: number, y: number) => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const animate = (time: number) => {
      frameId = 0;
      const elapsed = Math.min(time - lastFrameTime, 48);
      lastFrameTime = time;
      const easing = 1 - Math.exp(-elapsed / 78);

      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;

      const remaining = Math.hypot(targetX - currentX, targetY - currentY);
      if (remaining < 0.12) {
        currentX = targetX;
        currentY = targetY;
      }
      placeCursor(currentX, currentY);

      if (remaining >= 0.12) frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const edge = 7;
      targetX = Math.min(Math.max(event.clientX, edge), window.innerWidth - edge);
      targetY = Math.min(Math.max(event.clientY, edge), window.innerHeight - edge);

      if (!visible) {
        currentX = targetX;
        currentY = targetY;
        placeCursor(currentX, currentY);
        cursor.style.opacity = "1";
        visible = true;
      }

      if (!frameId) {
        lastFrameTime = performance.now();
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const closestInteractive = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest("a, button, [role='button'], .cursor-hover-target")
        : null;

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cursor.classList.toggle("is-hovered", Boolean(closestInteractive(event.target)));
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.relatedTarget === null) {
        visible = false;
        cursor.style.opacity = "0";
        cursor.classList.remove("is-hovered");
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        return;
      }

      cursor.classList.toggle("is-hovered", Boolean(closestInteractive(event.relatedTarget)));
    };

    const handleWindowBlur = () => {
      visible = false;
      cursor.style.opacity = "0";
      cursor.classList.remove("is-hovered");
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    document.documentElement.classList.add("custom-cursor-enabled");
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", handleWindowBlur);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [enabled]);

  return (
    <div ref={cursorRef} className="cursor-follower" aria-hidden="true">
      <span className="cursor-follower__orb" />
    </div>
  );
}
