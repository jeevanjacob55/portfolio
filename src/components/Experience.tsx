import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { experience } from "../data/experience";

export default function Experience() {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <section id="experience" className="py-24 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl text-ink mb-12">Experience</h2>

        <div className="border-l border-hairline">
          {experience.map((entry) => {
            const isOpen = openId === entry.id;
            return (
              <div key={entry.id} className="relative pl-8 pb-10 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-mint" />

                <div className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-2">
                  <p className="text-sm text-muted pt-0.5">{entry.dates}</p>

                  <div>
                    <button
                      onClick={() => setOpenId(isOpen ? null : entry.id)}
                      className="w-full flex items-start justify-between gap-4 text-left group"
                    >
                      <div>
                        <h3 className="text-ink font-medium">{entry.role}</h3>
                        <p className="text-muted text-sm mt-0.5">
                          {entry.company} · {entry.location}
                        </p>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 mt-1 text-muted transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-mint" : ""
                        }`}
                      />
                    </button>

                    <p className="text-muted text-sm mt-3 leading-relaxed">{entry.summary}</p>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-2 text-sm text-muted list-disc pl-4">
                          {entry.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                        {entry.stack && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {entry.stack.map((s) => (
                              <span
                                key={s}
                                className="text-xs px-2.5 py-1 rounded-full border border-hairline text-muted"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
