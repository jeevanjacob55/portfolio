export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  dates: string;
  location: string;
  details?: string[];
}

export const education: EducationEntry[] = [
  {
    id: "jec",
    degree: "B.Tech, Computer Science & Engineering", // confirm exact degree title
    institution: "Jyothi Engineering College (APJ Abdul Kalam Technological University)",
    dates: "Expected graduation — add year", // PLACEHOLDER
    location: "Kerala, India",
    details: [
      "Coursework spans data engineering, distributed systems, and full-stack development.",
    ],
  },
];
