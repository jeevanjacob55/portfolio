export interface Project {
  id: string;
  title: string;
  category: "Software Engineering" | "AI / Machine Learning" | "Robotics";
  description: string;
  longDescription: string[];
  tags: string[];
  images: string[]; // paths under /public/images/projects — replace with real screenshots
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: "jewelhub",
    title: "JewelHub for Gold Associations",
    category: "Software Engineering",
    description:
      "Multi-tenant B2B platform digitizing jewellery association operations — mobile app, admin console, and marketplace in one system.",
    longDescription: [
      "Developed a Jewellery Association Digital Platform consisting of a React Native mobile application and a web-based admin console to digitize association operations, improve business visibility, and centralize industry communication.",
      "Built a company-based login and role-based access system with a state, association, district, and unit hierarchy, enabling region-specific content and permission management.",
      "Developed a dashboard displaying gold and silver rates, market trends, urgent notices, association updates, and quick navigation to key features.",
      "Created a marketplace for discovering jewellery businesses and products, with membership-based visibility tiers and subscription-based exposure.",
      "Implemented an advertisement management system supporting campaign creation, media uploads, regional targeting, approval workflows, scheduled placements, and impression and click tracking.",
      "Built news, alerts, meetings, and notification modules with regional targeting, publishing controls, and customizable notification preferences.",
      "Developed a web-based admin console with reusable components for managing users, companies, membership tiers, advertisements, products, rates, news, meetings, and association hierarchy.",
      "Implemented administrative approval queues, campaign previews, rate management, analytics dashboards, audit logs, and scoped access controls to support centralized platform governance.",
      "Developed REST APIs and database models using Django REST Framework and PostgreSQL, integrating the backend with the React Native (Expo) application and web admin interface.",
    ],
    tags: ["React Native", "Expo", "React", "Django REST Framework", "PostgreSQL"],
    images: [
      "/images/projects/jewelhub-1.svg",
      "/images/projects/jewelhub-2.svg",
      "/images/projects/jewelhub-3.svg",
    ],
  },
  {
    id: "aaric-annotation",
    title: "AI-Powered Military Image Annotation Platform",
    category: "AI / Machine Learning",
    description:
      "Secure, offline-capable annotation platform used by Indian Army personnel to prepare large-scale image datasets for AI model training.",
    longDescription: [
      "Developed and shipped a secure, offline-capable AI annotation platform used by Indian Army personnel for annotating large-scale image datasets for AI model training, as one of two developers on the AARIC internship team.",
      "Built backend services using Flask, SQLAlchemy, and PostgreSQL to manage large-scale image datasets and annotation workflows.",
      "Implemented hierarchical Role-Based Access Control (RBAC) aligned with the Army's command structure, featuring manual user approval and granular permissions.",
      "Developed scalable data processing and export workflows for 100,000+ images, supporting structured dataset exports for AI model training.",
      "Contributed to end-to-end development, testing, debugging, and deployment under strict timelines and evolving requirements.",
    ],
    tags: ["Python", "Flask", "SQLAlchemy", "PostgreSQL", "React", "MinIO", "Redis", "Celery"],
    images: [
      "/images/projects/aaric-1.svg",
      "/images/projects/aaric-2.svg",
    ],
  },
  {
    id: "medbot",
    title: "Autonomous Medical Assistance Robot",
    category: "Robotics",
    description:
      "Autonomous robot combining sensor-driven navigation, medication scheduling, and AI-powered symptom analysis for basic healthcare assistance.",
    longDescription: [
      "Developed an autonomous medical assistance robot integrating intelligent navigation, medication management, and AI-powered symptom analysis to support basic healthcare assistance.",
      "Designed an autonomous navigation system using ultrasonic, IR, and MPU6050 sensors for real-time obstacle detection, motion tracking, and stable movement.",
      "Implemented control algorithms and hardware-software integration testing to improve navigation stability and operational reliability.",
      "Developed a companion website for managing medication schedules and scheduling water delivery times.",
      "Integrated AI-powered symptom processing that analyzes user-entered symptoms and provides preliminary health-related insights through the website.",
    ],
    tags: ["Embedded Systems", "Ultrasonic Sensors", "IR Sensors", "MPU6050", "Robotics", "AI"],
    images: ["/images/projects/medbot-1.svg"],
  },
];

export const categories = ["All", "Software Engineering", "AI / Machine Learning", "Robotics"] as const;
