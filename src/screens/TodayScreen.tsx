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
      <section className="rounded-[2rem] border border-emerald-300/30 bg-emerald-300/10 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-200">
          Complete
        </p>
        <h1 className="mt-4 text-3xl font-black">
          28개 학습을 모두 끝냈습니다.
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Trainer에서 틀린 문제를 반복하면 대회 전 감각을 유지하기 좋습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
            Poker Pace
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight">
            오늘은 한 손만 더 좋은 결정을 만듭니다.
          </h1>
        </div>
        <ProgressRing percent={percent} />
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#1c1917,#0c0a09)] p-5 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">
            Week {unit.week} Day {unit.day}
          </p>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-stone-200">
            {unit.estimatedMinutes} min
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-black">{unit.title}</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300">{unit.goal}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-stone-300">
          <div className="rounded-2xl bg-white/5 px-2 py-3">
            Lesson
            <span className="mt-1 block text-emerald-200">short</span>
          </div>
          <div className="rounded-2xl bg-white/5 px-2 py-3">
            Quiz
            <span className="mt-1 block text-emerald-200">
              {unit.quizIds.length}
            </span>
          </div>
          <div className="rounded-2xl bg-white/5 px-2 py-3">
            Course
            <span className="mt-1 block text-emerald-200">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onStartLesson(unit.id)}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-4 text-sm font-black uppercase tracking-[0.16em] text-stone-950 transition hover:bg-emerald-200"
        >
          Start lesson
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </section>
  );
}
