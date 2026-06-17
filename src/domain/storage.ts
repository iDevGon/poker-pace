import { initialProgress } from './progress';
import type { ProgressState } from './types';

export const STORAGE_KEY = 'poker-pace:v1:progress';

function isProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ProgressState>;
  return (
    Array.isArray(candidate.completedUnitIds) &&
    Array.isArray(candidate.quizAnswers)
  );
}

export function loadProgress(): ProgressState {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return initialProgress;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!isProgressState(parsed)) {
      return initialProgress;
    }

    return {
      ...initialProgress,
      ...parsed,
    };
  } catch {
    return initialProgress;
  }
}

export function saveProgress(progress: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
