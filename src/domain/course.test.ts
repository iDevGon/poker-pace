import { describe, expect, it } from 'vitest';
import { courseUnits, pickRandomQuizIds, quizzes } from './course';

describe('course quiz data', () => {
  it('has enough beginner quiz variety for the 4-week course', () => {
    expect(quizzes).toHaveLength(35);
  });

  it('uses unique quiz ids and unique quiz ids within each lesson', () => {
    expect(new Set(quizzes.map((quiz) => quiz.id)).size).toBe(quizzes.length);

    for (const unit of courseUnits) {
      expect(new Set(unit.quizIds).size).toBe(unit.quizIds.length);
    }
  });

  it('picks a shuffled unique trainer set from the available quiz ids', () => {
    const quizIds = quizzes.map((quiz) => quiz.id);
    const picked = pickRandomQuizIds(quizIds, 10, () => 0);

    expect(picked).toHaveLength(10);
    expect(new Set(picked).size).toBe(10);
    expect(picked).not.toEqual(quizIds.slice(0, 10));
  });
});
