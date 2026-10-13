import { certificates, education, experiences, majorProjects, practiceProjects, profile, skillGroups } from "../data/portfolio";
import type { ChatResponse, ChatTurn, PortfolioProject } from "../types";

const projects = [...majorProjects, ...practiceProjects];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function containsAny(text: string, terms: string[]) {
  return terms.some((term) => {
    const normalizedTerm = normalize(term);
    return text === normalizedTerm || text.includes(` ${normalizedTerm} `);
  });
}

function response(answer: string, section: string): ChatResponse {
  return { answer, links: [{ label: "Explore this section", href: `/#${section}` }] };
}

function findProject(question: string): PortfolioProject | undefined {
  const compactQuestion = question.replace(/\s/g, "");
  return projects.find((project) => {
    const title = normalize(project.title);
    return question.includes(title) || compactQuestion.includes(title.replace(/\s/g, ""));
  });
}

function answerProjectQuestion(question: string, project: PortfolioProject): ChatResponse {
  const wantsDetails = containsAny(question, ["explain", "details", "approach", "how", "problem", "technology", "technologies", "tech stack"]);
  const technologies = project.technologies.join(", ");
  const answer = wantsDetails
    ? `${project.title} (${project.category})\n\nSummary: ${project.summary}\n\nTechnologies: ${technologies}\n\nProblem: ${project.problem}\n\nApproach: ${project.approach}`
    : `${project.title} is a ${project.category.toLowerCase()} project. ${project.summary}\n\nTechnologies: ${technologies}`;
  return response(answer, "projects");
}

export async function answerPortfolioQuestion(message: string, history: ChatTurn[] = []): Promise<ChatResponse> {
  const question = normalize(message);
  if (!question) {
    return { answer: "Ask me about Ayan's skills, projects, education, experience, or contact details.", links: [] };
  }

  if (containsAny(question, ["hi", "hello", "hey", "namaste"])) {
    return {
      answer: `Hello! I'm a free portfolio guide. Ask me about ${profile.name}'s skills, projects, education, or experience.`,
      links: [{ label: "Explore the portfolio", href: "/#about" }],
    };
  }

  if (containsAny(question, ["contact", "email", "reach", "linkedin", "github"])) {
    return response(
      `You can contact ${profile.name} at ${profile.email}. You can also find him on GitHub (${profile.github}) and LinkedIn (${profile.linkedin}).`,
      "contact",
    );
  }

  const project = findProject(question);
  if (project) return answerProjectQuestion(question, project);

  if (containsAny(question, ["project", "projects", "work", "built", "portfolio"])) {
    const list = projects.map((item) => `• ${item.title} — ${item.summary}`).join("\n");
    return response(`Here are the projects currently listed in the portfolio:\n\n${list}`, "projects");
  }

  const requestedSkills = skillGroups.flatMap((group) => group.skills)
    .filter((skill) => question.includes(normalize(skill.name)));
  if (
    requestedSkills.length > 0 ||
    containsAny(question, ["skill", "skills", "technology", "technologies", "tech stack", "proficient", "know", "language", "level"])
  ) {
    const requestedGroup = skillGroups.find((group) => question.includes(normalize(group.name)));
    const selectedGroups = requestedGroup
      ? [requestedGroup]
      : requestedSkills.length
        ? skillGroups.map((group) => ({
          ...group,
          skills: group.skills.filter((skill) => requestedSkills.some((requested) => requested.name === skill.name)),
        })).filter((group) => group.skills.length > 0)
        : skillGroups;
    const details = selectedGroups.map((group) =>
      `${group.name}: ${group.skills.map((skill) => `${skill.name} (${skill.level})`).join(", ")}`,
    ).join("\n");
    return response(`Skills listed in the portfolio (levels are estimates):\n\n${details}`, "skills");
  }

  if (containsAny(question, ["education", "degree", "college", "school", "study", "studied", "class xii", "12th", "percentage", "marks"])) {
    const details = education.map((item) => {
      const facts = [item.level, item.institution, item.result, item.year, item.detail].filter(Boolean);
      return `• ${facts.join(" · ")}`;
    }).join("\n");
    return response(`Education listed in the portfolio:\n\n${details}`, "education");
  }

  if (containsAny(question, ["certificate", "certificates", "certification", "bootcamp", "course", "courses"])) {
    const details = certificates.map((item) =>
      `• ${item.title} — ${item.organization}${item.date ? ` (${item.date})` : ""}`,
    ).join("\n");
    return response(
      details ? `Certificates listed in the portfolio:\n\n${details}` : "No certificates are listed yet.",
      "certificates",
    );
  }

  if (containsAny(question, ["experience", "intern", "job", "work experience"])) {
    const details = experiences.map((item) =>
      `• ${item.title} at ${item.organization} (${item.type})${item.description ? ` — ${item.description}` : ""}`,
    ).join("\n");
    return response(`Experience listed in the portfolio:\n\n${details}`, "experience");
  }

  if (containsAny(question, ["who", "about", "ayan", "background", "introduce", "location", "where"])) {
    return response(
      `${profile.name} is a ${profile.title}, based in ${profile.location}. ${profile.introduction}`,
      "about",
    );
  }

  const previousQuestion = [...history].reverse().find((turn) => turn.role === "user")?.content;
  if (previousQuestion) {
    const previousProject = findProject(normalize(previousQuestion));
    if (previousProject && containsAny(question, ["more", "detail", "it", "that", "this"])) {
      return answerProjectQuestion(normalize(`${previousQuestion} details`), previousProject);
    }
  }

  return {
    answer: "I can answer questions using the information in this portfolio. Try asking about Ayan's projects, skills, education, experience, or contact details.",
    links: [{ label: "Explore the portfolio", href: "/#about" }],
  };
}
