import { Project } from "../data/projects";
import ImageCarousel from "./ImageCarousel";

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <div className="gradient-card cursor-hover-target flex flex-col h-full rounded-2xl border border-hairline overflow-hidden hover:border-mint/30 transition-colors">
      <ImageCarousel images={project.images} alt={project.title} />

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-bg font-medium mb-1.5">{project.title}</h3>
        <p className="text-emerald text-sm leading-relaxed line-clamp-3 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full border border-emerald/20 text-emerald">
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={onOpen}
          className="mt-auto text-sm text-teal hover:text-bg transition-colors self-start"
        >
          View case study
        </button>
      </div>
    </div>
  );
}
