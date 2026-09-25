export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript"],
  },
  {
    category: "Backend",
    items: ["Django", "Django REST Framework", "Flask", "SQLAlchemy", "REST APIs", "Celery"],
  },
  {
    category: "Frontend & Mobile",
    items: ["React", "React Native", "Expo", "Vite"],
  },
  {
    category: "Data & Infrastructure",
    items: ["PostgreSQL", "Redis", "PySpark", "Airflow", "Docker", "MinIO"],
  },
];
