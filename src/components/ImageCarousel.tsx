import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  // Single image — static thumbnail, no controls
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-card">
        <img
          src={images[0]}
          alt={alt}
          className="project-image w-full h-full object-cover"
          loading="lazy"
          onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
        />
      </div>
    );
  }

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-card group/carousel">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} — screenshot ${i + 1} of ${images.length}`}
          loading="lazy"
          className={`project-image absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
        />
      ))}

      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          goTo(index - 1);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-black/40 backdrop-blur
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
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-black/40 backdrop-blur
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
