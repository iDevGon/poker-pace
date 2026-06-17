import { ArrowRight } from 'lucide-react';
import { ProgressRing } from '../components/ProgressRing';
import type { CourseUnit } from '../domain/types';

type TodayScreenProps = {
  unit: CourseUnit | null;
  percent: number;
  completedCount: number;
  totalCount: number;
  onStartLesson: (unitId: string) => void;
};

export function TodayScreen({
  unit,
  percent,
  completedCount,
  totalCount,
  onStartLesson,
}: TodayScreenProps) {
  if (!unit) {
    return (
      <section className="surface rise-in rounded-[2rem] p-6">
        <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-[var(--mint-400)]">
          Complete
        </p>
        <h1 className="font-display mt-4 text-3xl font-black">
          28개 학습을 모두 끝냈습니다.
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-300)]">
          Trainer에서 틀린 문제를 반복하면 대회 전 감각을 유지하기 좋습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rise-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-[var(--mint-400)]">
            Poker Pace
          </p>
          <h1 className="font-display mt-3 max-w-[11ch] text-[1.85rem] font-black leading-[1.16] tracking-[-0.01em]">
            오늘은 한 손만 더 좋은 결정을 만듭니다.
          </h1>
        </div>
        <ProgressRing percent={percent} />
      </div>

      <div className="table-panel rounded-[2rem] p-5">
        <div className="relative flex items-center justify-between gap-3">
          <p className="font-display text-xs font-black uppercase tracking-[0.22em] text-[var(--clay-300)]">
            Week {unit.week} Day {unit.day}
          </p>
          <span className="chip px-3 py-1 text-xs font-bold">
            {unit.estimatedMinutes} min
          </span>
        </div>
        <h2 className="font-display relative mt-6 text-2xl font-black">
          {unit.title}
        </h2>
        <p className="relative mt-3 text-sm leading-7 text-[var(--ink-300)]">
          {unit.goal}
        </p>
        <div className="relative mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold text-[var(--ink-300)]">
          <div className="border-y border-[oklch(86%_0.018_94_/_0.11)] py-3">
            Lesson
            <span className="mt-1 block text-[var(--mint-400)]">short</span>
          </div>
          <div className="border-y border-[oklch(86%_0.018_94_/_0.11)] py-3">
            Quiz
            <span className="mt-1 block text-[var(--mint-400)]">
              {unit.quizIds.length}
            </span>
          </div>
          <div className="border-y border-[oklch(86%_0.018_94_/_0.11)] py-3">
            Course
            <span className="mt-1 block text-[var(--mint-400)]">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onStartLesson(unit.id)}
          className="primary-action relative mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black uppercase tracking-[0.16em] transition duration-200 hover:brightness-105 active:translate-y-px"
        >
          Start lesson
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </section>
  );
}
