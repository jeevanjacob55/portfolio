import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import { Project } from "../data/projects";
import ImageCarousel from "./ImageCarousel";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-hairline bg-[#09090B]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-ink hover:bg-black/70"
            >
              <X size={16} />
            </button>

            <ImageCarousel images={project.images} alt={project.title} />

            <div className="p-6 sm:p-8">
              <p className="text-xs text-mint mb-2">{project.category}</p>
              <h3 className="font-display text-2xl text-ink mb-4">{project.title}</h3>

              <div className="space-y-3 text-muted text-sm leading-relaxed mb-6">
                {project.longDescription.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-hairline text-muted">
                    {t}
                  </span>
                ))}
              </div>

              {(project.github || project.demo) && (
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-ink border border-hairline rounded-full px-4 py-2 hover:border-mint/50 hover:text-mint transition-colors"
                    >
                      <Github size={15} /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-ink border border-hairline rounded-full px-4 py-2 hover:border-mint/50 hover:text-mint transition-colors"
                    >
                      <ExternalLink size={15} /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
