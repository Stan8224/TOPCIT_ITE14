
export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  courseId: number;
  moduleId: number;
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
};

export type ModuleContent = {
  type: 'paragraph' | 'header' | 'list';
  text?: string;
  items?: string[];
};

export type CourseModule = {
  id: number;
  title: string;
  description: string;
  content: ModuleContent[];
  quizId: string;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  color: string;
  modules: CourseModule[];
};

    