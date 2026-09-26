export interface SkillGroup {
  category: string;
  items: string[];
}
export const skills: SkillGroup[] = [
  {
    category: "Backend",
    items: [
      "Python",
      "Django",
      "Django REST Framework",
      "FastAPI",
      "Flask",
      "RESTful APIs",
      "SQLAlchemy",
      "Celery",
    ],
  },

  {
    category: "Frontend",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Responsive UI",
      "REST API Integration",
    ],
  },

  {
    category: "Database",
    items: [
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Redis",
      "SQL",
      "Database Design",
      "ORM",
    ],
  },

  {
    category: "Testing",
    items: [
      "Pytest",
      "unittest",
      "Jest",
      "Postman",
      "API Testing",
      "Integration Testing",
      "Test-Driven Development",
    ],
  },

  {
    category: "DevOps & Cloud",
    items: [
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "AWS",
      "Linux",
      "Nginx",
      "Render",
      "Environment Configuration",
    ],
  },

  {
    category: "Tools & Practices",
    items: [
      "Git",
      "GitHub",
      "Jira",
      "VS Code",
      "Agile (Scrum)",
      "JSON",
      "YAML",
      "API Documentation",
      "Debugging",
    ],
  },
];