import type { EducationEntry, PortfolioProject, ProjectCategory, SkillGroup } from "../types";

export const profile = {
  name: "Ayan Mansoori",
  initials: "AM",
  title: "Computer Science Engineer | Machine Learning Engineer | AI Developer",
  location: "Ujjain, Madhya Pradesh, India",
  email: "ayanmansuri535@gmail.com",
  introduction:
    "I build practical machine learning solutions and AI-powered applications, combining data analysis, model development, backend engineering, and deployment to solve real-world problems.",
  headline: "Turning data into intelligence, and ideas into intelligent systems.",
  github: "https://github.com/ayan501",
  linkedin: "https://www.linkedin.com/in/ayan-mansoori501",
  image: "/images/PROFILE1.png",
  resume: "/resume.pdf",
};

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export const skillGroups: SkillGroup[] = [
  {
    name: "Programming",
    skills: [
      { name: "Python", level: "Proficient" },
      { name: "SQL", level: "Proficient" },
      { name: "JavaScript", level: "Working knowledge with AI" },
      { name: "TypeScript", level: "Working knowledge with AI" },
    ],
  },
  {
    name: "Data Science",
    skills: [
      { name: "NumPy", level: "Proficient" },
      { name: "Pandas", level: "Proficient" },
      { name: "Matplotlib", level: "Working knowledge" },
      { name: "Seaborn", level: "Working knowledge" },
      { name: "Exploratory Data Analysis", level: "Proficient" },
      { name: "Statistics", level: "Working knowledge" },
    ],
  },
  {
    name: "Machine Learning",
    skills: [
      { name: "Scikit-learn", level: "Proficient" },
      { name: "Classification", level: "Proficient" },
      { name: "Regression", level: "Working knowledge" },
      { name: "Feature Engineering", level: "Working knowledge" },
      { name: "Model Evaluation", level: "Working knowledge" },
      { name: "XGBoost", level: "Working knowledge" },
    ],
  },
  {
    name: "Deep Learning & Vision",
    skills: [
      { name: "TensorFlow", level: "Working knowledge" },
      { name: "Keras", level: "Working knowledge" },
      { name: "CNNs", level: "Working knowledge" },
      { name: "ANNs", level: "Working knowledge" },
      { name: "Transformers", level: "Working knowledge" },
    ],
  },
  {
    name: "Backend & Data",
    skills: [
      { name: "FastAPI", level: "Working knowledge" },
      { name: "Flask", level: "Working knowledge" },
      { name: "REST APIs", level: "Working knowledge" },
      { name: "PostgreSQL", level: "Working knowledge" },
      { name: "SQLAlchemy", level: "Familiar" },
    ],
  },
  {
    name: "AI & Tools",
    skills: [
      { name: "Generative AI", level: "Working knowledge" },
      { name: "Gemini API", level: "Working knowledge" },
      { name: "Git", level: "Proficient" },
      { name: "GitHub", level: "Proficient" },
      { name: "Docker", level: "Familiar" },
      { name: "CI/CD", level: "Familiar" },
    ],
  },
];

export const experiences = [
  {
    title: "Data Science / AI Intern",
    organization: "Darkiee Technologies",
    type: "Internship",
    description:
      "June 2026 - Currently Working",
  },
];

export const majorProjects: PortfolioProject[] = [
  {
    title: "TraderIQ",
    category: "AI Applications",
    summary: "A trader intelligence and risk-analysis application using historical trading data.",
    problem: "Trading histories can be difficult to evaluate consistently across many transactions.",
    approach:
      "The workflow spans data processing, feature engineering, model training, and an inference API. Performance metrics are intentionally omitted until verified.",
    technologies: ["Python", "Random Forest", "XGBoost", "FastAPI", "PostgreSQL", "Docker"],
  },

  {
    title: "LumenRead Comprehension",
    category: "AI Applications",
    summary: "An AI-powered reading comprehension application designed to help users understand, analyze, and interact with textual content.",
    problem: "Understanding lengthy textual content can be time-consuming, making it difficult for users to extract key information and comprehend important concepts efficiently.",
    approach:
      "The application uses a modular backend architecture with FastAPI, authentication, and structured API endpoints to support secure user interactions and reading-related functionality. The backend includes JWT-based authentication, protected routes, and a service-oriented design for maintainability and scalability.",
    technologies: ["Python", "FastAPI", "JWT Authentication", "Pydantic", "REST APIs", "Pytest"],
  },

{
  title: "Job Application Tracker",
  category: "Backend Development",
  summary: "A backend application designed to manage job applications, track application statuses, organize company information, and streamline the job search process.",
  problem: "Managing multiple job applications across different companies can make it difficult to track application statuses, maintain company details, and follow up on opportunities efficiently.",
  approach:
    "Developed a RESTful backend using FastAPI and PostgreSQL with SQLAlchemy ORM for database management. Implemented JWT-based authentication, structured API endpoints, database relationships, and CRUD operations to manage job applications, companies, and application statuses.",
  technologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "JWT Authentication", "REST APIs", "CRUD Operations"],
},

];

export const practiceProjects: PortfolioProject[] = [
  {
    title: "Credit Card Fraud Detection",
    category: "Machine Learning",
    summary: "A classification approach to identifying potentially fraudulent transactions in imbalanced data.",
    problem: "Fraud examples are uncommon, so accuracy alone can hide poor detection performance.",
    approach:
      "The model is assessed with precision, recall, F1-score, and a confusion matrix; no unverified results are shown.",
    technologies: ["Python", "Scikit-learn", "Classification", "Model Evaluation"],
  },
  {
    title: "Customer Churn Prediction",
    category: "Machine Learning",
    summary: "A classification project exploring customer churn prediction.",
    problem: "Organizations need to identify customer patterns associated with churn.",
    approach:
      "The workflow covers exploratory analysis, preprocessing, feature engineering, model training, and evaluation. Accuracy is omitted until verified.",
    technologies: ["Python", "Pandas", "Scikit-learn", "Classification"],
  },
  {
    title: "Diabetes Prediction System",
    category: "Machine Learning",
    summary: "A machine learning project estimating diabetes risk from input features.",
    problem: "A predictive model can help demonstrate an end-to-end applied classification workflow.",
    approach:
      "The project covers data preprocessing, model implementation, and evaluation. Its predictions are informational and are not a medical diagnosis.",
    technologies: ["Python", "Scikit-learn", "Classification", "Model Evaluation"],
  },
  {
    title: "MNIST CNN Classifier",
    category: "Deep Learning",
    summary: "A convolutional neural network for handwritten-digit classification.",
    problem: "Recognizing handwritten digits is a foundational image-classification task.",
    approach:
      "A CNN is trained and evaluated on MNIST. An accuracy figure is omitted until the original evaluation is verified.",
    technologies: ["Python", "TensorFlow", "Keras", "CNN", "MNIST"],
  },
];

export const projectCategories: Array<"All" | ProjectCategory> = [
  "All",
  "Machine Learning",
  "Deep Learning",
  "AI Applications",
  "Backend Development",
  "Computer Vision",
];

export const education: EducationEntry[] = [
  {
    level: "XII Class",
    institution: "Bhartiya High School",
    detail: "Learned higher Concepts of Physics,Chemistry And Maths",
    result: "89.9%",
    year: "2021",
  },
  {
    level: "B.Tech in Computer Science and Engineering",
    institution: "Shri Guru Sandipani Institute of Science and Technology",
    detail: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
    result: "6.8 CGPA",
    year : "2022-2026"
  },
];

export const certificates: Array<{
  title: string;
  organization: string;
  date?: string;
  credentialUrl?: string;
}> = [
  {
    title: "Data Science, ML, DL AND NLP Bootcamp",
    organization: "Krish Naik",
  },
  {
    title: "Data Science with Harry",
    organization: "CodeWithHarry",
  },
];
