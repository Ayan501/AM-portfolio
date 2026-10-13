export type ProjectCategory =
  | "Machine Learning"
  | "Deep Learning"
  | "AI Applications"
  | "Backend Development"
  | "Computer Vision";

export type SkillLevel = "Advanced" | "Proficient" | "Working knowledge" | "Working knowledge with AI" | "Familiar";

export interface PortfolioSkill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  name: string;
  skills: PortfolioSkill[];
}

export interface EducationEntry {
  level: string;
  institution: string;
  result?: string;
  year?: string;
  detail?: string;
}

export interface PortfolioProject {
  title: string;
  category: ProjectCategory;
  summary: string;
  problem: string;
  approach: string;
  technologies: string[];
  metric?: string;
  repositoryUrl?: string;
  demoUrl?: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  links?: Array<{ label: string; href: string }>;
}

export interface ChatResponse {
  answer: string;
  links: Array<{ label: string; href: string }>;
}