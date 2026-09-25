import { useMemo, useState } from "react";
import { projects, categories, Project } from "../data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [active, setActive] = useState<Project | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="projects" className="py-24 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-10">
          <h2 className="font-heading font-semibold text-3xl text-ink text-center">Projects</h2>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                  filter === c
                    ? "border-mint/50 text-mint bg-mint/10"
                    : "border-hairline text-muted hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => setActive(project)} />
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
