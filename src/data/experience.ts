export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  summary: string;
  details: string[];
  stack?: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "aaric",
    role: "Software Developer Intern",
    company: "Army AI Research & Incubation Centre (AARIC)",
    location: "Bangalore, India",
    dates: "01/2026 - 04/2026",
    summary:
      "Developed and shipped a secure, offline-capable AI annotation platform used by Indian Army personnel for annotating large-scale image datasets for AI model training.",
    details: [
      "Selected as one of 10 candidates for the internship; one of two developers building and shipping the platform end to end.",
      "Built backend services using Flask, SQLAlchemy, and PostgreSQL to manage large-scale image datasets and annotation workflows.",
      "Implemented hierarchical Role-Based Access Control (RBAC) aligned with the Army's command structure, featuring manual user approval and granular permissions.",
      "Developed scalable data processing and export workflows for 100,000+ images, supporting structured dataset exports for AI model training.",
      "Contributed to end-to-end development, testing, debugging, and deployment of a production-oriented application under strict timelines and evolving requirements.",
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "PostgreSQL", "React", "MinIO", "Redis", "Celery", "PyInstaller"],
  },
  {
    id: "thextruder",
    role: "Frontend Developer",
    company: "TheXtruder",
    location: "Thrissur, Kerala",
    dates: "05/2025 - 06/2025",
    summary:
      "Developed a client-facing React website, working directly with clients to translate business requirements into responsive, functional web experiences.",
    details: [
      "Built and maintained a production React website for external clients.",
      "Worked directly with clients to turn business requirements into responsive, functional UI.",
    ],
    stack: ["React"],
  },
];
