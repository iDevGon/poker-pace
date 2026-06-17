import { describe, expect, it } from 'vitest';
import { courseUnits } from './course';
import {
  completeUnit,
  getCompletionPercent,
  getMissedQuizIds,
  getNextRecommendedUnit,
  initialProgress,
  recordQuizAnswer,
} from './progress';

describe('progress helpers', () => {
  it('recommends the first unfinished unit', () => {
    const first = getNextRecommendedUnit(courseUnits, initialProgress);
    expect(first?.id).toBe('w1d1');
  });

  it('allows multiple units to be completed without date locks', () => {
    const afterFirst = completeUnit(initialProgress, 'w1d1');
    const afterSecond = completeUnit(afterFirst, 'w1d2');
    expect(afterSecond.completedUnitIds).toEqual(['w1d1', 'w1d2']);
    expect(getNextRecommendedUnit(courseUnits, afterSecond)?.id).toBe('w1d3');
  });

  it('tracks missed quiz ids from answer history', () => {
    const progress = recordQuizAnswer(initialProgress, {
      quizId: 'q-preflop-position-1',
      selectedChoiceId: 'call',
      correct: false,
    });
    expect(getMissedQuizIds(progress)).toEqual(['q-preflop-position-1']);
  });

  it('deduplicates completed units and missed quiz ids', () => {
    const completed = completeUnit(
      completeUnit(initialProgress, 'w1d1'),
      'w1d1',
    );
    const missedTwice = recordQuizAnswer(
      recordQuizAnswer(completed, {
        quizId: 'q-preflop-position-1',
        selectedChoiceId: 'call',
        correct: false,
      }),
      {
        quizId: 'q-preflop-position-1',
        selectedChoiceId: 'raise',
        correct: false,
      },
    );
    expect(missedTwice.completedUnitIds).toEqual(['w1d1']);
    expect(getMissedQuizIds(missedTwice)).toEqual(['q-preflop-position-1']);
  });

  it('calculates completion percent', () => {
    const progress = completeUnit(initialProgress, 'w1d1');
    expect(getCompletionPercent(courseUnits, progress)).toBe(4);
  });
});
