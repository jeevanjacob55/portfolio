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
    dates: "2022-2026", // PLACEHOLDER
    location: "Kerala, India",
    details: [
      "Operating Systems, Data Structures, Analysis Of Algorithms, Artificial Intelligence, Networking, Databases, Cloud Computing",
    ],
  },
];
