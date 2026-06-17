import { RotateCcw, Shuffle } from 'lucide-react';
import { quizzes } from '../domain/course';
import type { Quiz } from '../domain/types';

type TrainerScreenProps = {
  missedQuizIds: string[];
  onStartQuiz: (quizIds: string[]) => void;
};

export function TrainerScreen({
  missedQuizIds,
  onStartQuiz,
}: TrainerScreenProps) {
  const missedQuizzes = missedQuizIds
    .map((quizId) => quizzes.find((quiz) => quiz.id === quizId))
    .filter((quiz): quiz is Quiz => Boolean(quiz));
  const randomQuizIds = quizzes.slice(0, 10).map((quiz) => quiz.id);

  return (
    <section className="rise-in space-y-6">
      <div>
        <p className="eyebrow">복습</p>
        <h1 className="font-display mt-3 text-[2rem] font-bold leading-tight">
          퀴즈 복습
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          틀린 문제는 다시 보고, 랜덤 10문제로 실전 감각을 이어갑니다.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onStartQuiz(randomQuizIds)}
        className="primary-action flex min-h-16 w-full items-center gap-3 rounded-[0.95rem] px-5 text-left transition hover:brightness-105 active:translate-y-px"
      >
        <Shuffle aria-hidden="true" className="size-6" />
        <span>
          <span className="block text-sm font-black uppercase tracking-[0.12em]">
            랜덤 10문제
          </span>
          <span className="mt-1 block text-xs font-bold text-[oklch(27%_0.038_43)]">
            코스 전체에서 골고루 섞어 풉니다.
          </span>
        </span>
      </button>

      <div className="surface rounded-[1.1rem] p-5">
        <div className="flex items-center gap-3">
          <RotateCcw
            aria-hidden="true"
            className="size-5 text-[var(--mint-400)]"
          />
          <h2 className="font-display text-lg font-bold">틀린 문제</h2>
        </div>
        {missedQuizzes.length === 0 ? (
          <p className="mt-4 rounded-[0.85rem] bg-[oklch(13%_0.018_165_/_0.62)] p-4 text-sm font-bold leading-7 text-[var(--ink-300)]">
            아직 틀린 문제가 없습니다. 오늘 퀴즈를 풀고 틀린 문제가 생기면
            여기에 모입니다.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {missedQuizzes.map((quiz) => (
              <li key={quiz.id}>
                <button
                  type="button"
                  onClick={() => onStartQuiz([quiz.id])}
                  className="w-full rounded-[0.85rem] border border-[oklch(86%_0.018_94_/_0.12)] bg-[oklch(13%_0.018_165_/_0.62)] p-4 text-left text-sm font-bold leading-7 text-[var(--ink-200)] transition hover:bg-[oklch(86%_0.018_94_/_0.06)]"
                >
                  {quiz.prompt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
