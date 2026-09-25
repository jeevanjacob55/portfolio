import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { experience } from "../data/experience";

export default function Experience() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const leaveTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
  }, []);

  const handlePointerEnter = (event: PointerEvent<HTMLElement>, id: string) => {
    if (
      event.pointerType !== "touch" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
      setActiveId(id);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    const nextEntry = event.relatedTarget instanceof Element
      ? event.relatedTarget.closest<HTMLElement>("[data-experience-entry]")
      : null;
    if (nextEntry) {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
      setActiveId(nextEntry.dataset.experienceEntry ?? null);
    } else {
      leaveTimer.current = window.setTimeout(() => {
        setActiveId(null);
        leaveTimer.current = null;
      }, 90);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, id: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setActiveId((current) => (current === id ? null : id));
  };

  const handleClick = (event: MouseEvent<HTMLElement>, id: string) => {
    const pointerType = (event.nativeEvent as unknown as { pointerType?: string }).pointerType;
    const assistiveActivation = event.detail === 0;
    const touchActivation = pointerType === "touch" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (assistiveActivation || touchActivation) {
      setActiveId((current) => (current === id ? null : id));
    }
  };

  return (
    <section id="experience" className="py-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading font-semibold text-3xl text-ink text-center mb-14">
          Experience
        </h2>

        <div className="experience-timeline">
          {experience.map((entry) => {
            const isOpen = activeId === entry.id;
            const detailsId = `experience-details-${entry.id}`;

            return (
              <article
                key={entry.id}
                className="experience-entry"
                data-experience-entry={entry.id}
                onPointerEnter={(event) => handlePointerEnter(event, entry.id)}
                onPointerLeave={handlePointerLeave}
              >
                <div
                  className="experience-entry__main"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={detailsId}
                  onKeyDown={(event) => handleKeyDown(event, entry.id)}
                  onClick={(event) => handleClick(event, entry.id)}
                >
                  <p className="experience-entry__date">{entry.dates}</p>
                  <span className="experience-entry__marker" aria-hidden="true" />

                  <div className="experience-entry__content">
                    <div className="experience-entry__heading">
                      <h3 className="experience-entry__role">{entry.role}</h3>
                      <ChevronDown
                        className={`experience-entry__chevron${isOpen ? " is-open" : ""}`}
                        size={18}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="experience-entry__secondary experience-entry__company">
                      {entry.company}
                    </p>
                    <p className="experience-entry__secondary experience-entry__location">
                      <MapPin size={14} aria-hidden="true" />
                      <span>{entry.location}</span>
                    </p>
                  </div>
                </div>

                <div
                  id={detailsId}
                  className={`experience-entry__details${isOpen ? " is-open" : ""}`}
                  role="region"
                  aria-label={`${entry.role} at ${entry.company} details`}
                  aria-hidden={!isOpen}
                  onClick={(event) => handleClick(event, entry.id)}
                >
                  <div className="experience-entry__details-inner">
                    <p className="experience-entry__description">{entry.summary}</p>
                    <ul className="experience-entry__list">
                      {entry.details.map((detail, index) => (
                        <li key={`${entry.id}-detail-${index}`}>{detail}</li>
                      ))}
                    </ul>
                    {entry.stack && (
                      <div className="experience-entry__stack">
                        {entry.stack.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
