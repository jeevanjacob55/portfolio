import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ROTATE_MS = 3500;

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (images.length <= 1 || paused || prefersReducedMotion.current) {
      clearTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, ROTATE_MS);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, images.length]);

  // Ensure the timer is always cleaned up on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  if (images.length === 0) return null;

  // Single image — static thumbnail, no controls
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-card">
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <div
      className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-card group/carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} — screenshot ${i + 1} of ${images.length}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          goTo(index - 1);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur
                   flex items-center justify-center text-ink opacity-0 group-hover/carousel:opacity-100
                   focus-visible:opacity-100 transition-opacity"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          goTo(index + 1);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur
                   flex items-center justify-center text-ink opacity-0 group-hover/carousel:opacity-100
                   focus-visible:opacity-100 transition-opacity"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-mint" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
