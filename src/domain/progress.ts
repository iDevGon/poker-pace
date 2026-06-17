import type { CourseUnit, ProgressState, QuizAnswerRecord } from './types';

export const initialProgress: ProgressState = {
  completedUnitIds: [],
  currentUnitId: null,
  quizAnswers: [],
};

export function getNextRecommendedUnit(
  units: CourseUnit[],
  progress: ProgressState,
) {
  return (
    units.find((unit) => !progress.completedUnitIds.includes(unit.id)) ?? null
  );
}

export function completeUnit(
  progress: ProgressState,
  unitId: string,
): ProgressState {
  const completedUnitIds = progress.completedUnitIds.includes(unitId)
    ? progress.completedUnitIds
    : [...progress.completedUnitIds, unitId];

  return {
    ...progress,
    completedUnitIds,
    currentUnitId: unitId,
  };
}

export function recordQuizAnswer(
  progress: ProgressState,
  answer: QuizAnswerRecord,
): ProgressState {
  return {
    ...progress,
    quizAnswers: [...progress.quizAnswers, answer],
  };
}

export function getMissedQuizIds(progress: ProgressState) {
  return [
    ...new Set(
      progress.quizAnswers
        .filter((answer) => !answer.correct)
        .map((answer) => answer.quizId),
    ),
  ];
}

export function getCompletionPercent(
  units: CourseUnit[],
  progress: ProgressState,
) {
  if (units.length === 0) {
    return 0;
  }
  return Math.round((progress.completedUnitIds.length / units.length) * 100);
}
