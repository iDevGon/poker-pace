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
    <section className="space-y-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
          Trainer
        </p>
        <h1 className="mt-3 text-3xl font-black">퀴즈 복습</h1>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          틀린 문제는 다시 보고, 랜덤 10문제로 실전 감각을 유지합니다.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onStartQuiz(randomQuizIds)}
        className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-amber-200 px-5 text-left text-stone-950"
      >
        <Shuffle aria-hidden="true" className="size-6" />
        <span>
          <span className="block text-sm font-black uppercase tracking-[0.12em]">
            Random 10 questions
          </span>
          <span className="mt-1 block text-xs font-bold text-stone-700">
            코스 전체에서 빠르게 섞어 풉니다.
          </span>
        </span>
      </button>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <RotateCcw aria-hidden="true" className="size-5 text-emerald-300" />
          <h2 className="text-lg font-black">Missed questions</h2>
        </div>
        {missedQuizzes.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-stone-950/60 p-4 text-sm font-bold leading-6 text-stone-300">
            No missed questions yet. 오늘 퀴즈를 풀고 틀린 문제가 생기면 여기에
            모입니다.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {missedQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                type="button"
                onClick={() => onStartQuiz([quiz.id])}
                className="w-full rounded-2xl border border-white/10 bg-stone-950/60 p-4 text-left text-sm font-bold leading-6 text-stone-200"
              >
                {quiz.prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
