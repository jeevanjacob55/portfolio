import { MapPin } from "lucide-react";
import { education } from "../data/education";
import SectionHeading from "./SectionHeading";

export default function Education() {
  return (
    <section id="education" className="py-4 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="Education" />

        <div className="experience-timeline education-timeline">
          {education.map((entry) => (
            <article key={entry.id} className="experience-entry education-entry">
              <div className="experience-entry__main education-entry__main">
                <p className="experience-entry__date">{entry.dates}</p>
                <span className="experience-entry__marker" aria-hidden="true" />

                <div className="experience-entry__content">
                  <div className="experience-entry__heading">
                    <h3 className="experience-entry__role">{entry.degree}</h3>
                  </div>
                  <p className="experience-entry__secondary experience-entry__company">
                    {entry.institution}
                  </p>
                  <p className="experience-entry__secondary experience-entry__location">
                    <MapPin size={14} aria-hidden="true" />
                    <span>{entry.location}</span>
                  </p>
                  {entry.details && (
                    <ul className="experience-entry__list mt-3">
                      {entry.details.map((detail, index) => (
                        <li key={`${entry.id}-detail-${index}`}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
