import { Project } from "../data/projects";
import { showProjectImageCarousels } from "../data/projectDisplayConfig";
import ImageCarousel from "./ImageCarousel";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <div className="gradient-card project-card cursor-hover-target flex flex-col h-full rounded-2xl border border-hairline overflow-hidden">
      {showProjectImageCarousels && <ImageCarousel images={project.images} alt={project.title} />}

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-ink font-medium mb-1.5">{project.title}</h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full border border-hairline text-muted">
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={onOpen}
          className="project-card__action mt-auto text-sm self-start"
        >
          View details <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
