export type QuizType = 'decision' | 'reading';

export type QuizChoice = {
  id: string;
  label: string;
};

export type Quiz = {
  id: string;
  type: QuizType;
  prompt: string;
  context: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation: string;
  tags: string[];
};

export type LessonBlock = {
  heading: string;
  body: string;
};

export type CourseUnit = {
  id: string;
  week: number;
  day: number;
  title: string;
  goal: string;
  estimatedMinutes: number;
  lessonBlocks: LessonBlock[];
  quizIds: string[];
};

export type QuizAnswerRecord = {
  quizId: string;
  selectedChoiceId: string;
  correct: boolean;
};

export type ProgressState = {
  completedUnitIds: string[];
  currentUnitId: string | null;
  quizAnswers: QuizAnswerRecord[];
  tournamentChecklist: Record<string, boolean>;
};

export type TournamentChecklistItem = {
  id: string;
  label: string;
  description: string;
};

export type GtoActionMix = {
  raise: number;
  call: number;
  fold: number;
};

export type GtoHandStrategy = GtoActionMix & {
  id: string;
  note: string;
  exploit: string;
};

export type GtoSpot = {
  id: string;
  category: 'Open' | 'Defend' | 'Vs 3-bet';
  title: string;
  format: string;
  stackDepth: string;
  position: string;
  description: string;
  hands: GtoHandStrategy[];
};
