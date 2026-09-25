import { education } from "../data/education";

export default function Education() {
  return (
    <section id="education" className="py-4 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading font-semibold text-3xl text-ink text-center mb-14">Education</h2>

        <div className="border-l border-hairline">
          {education.map((entry) => (
            <div key={entry.id} className="relative pl-8 pb-10 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal" />

              <div className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-2">
                <p className="text-sm text-muted pt-0.5">{entry.dates}</p>

                <div>
                  <h3 className="text-ink font-medium">{entry.degree}</h3>
                  <p className="text-muted text-sm mt-0.5">
                    {entry.institution} · {entry.location}
                  </p>
                  {entry.details && (
                    <ul className="space-y-1.5 text-sm text-muted list-disc pl-4 mt-3">
                      {entry.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
