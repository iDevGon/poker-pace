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
      <section className="surface rise-in rounded-[1.1rem] p-6">
        <p className="eyebrow">완료</p>
        <h1 className="font-display mt-4 text-3xl font-black">
          28개 학습을 모두 끝냈습니다.
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-300)]">
          복습에서 틀린 문제를 반복하면 판단 감각을 유지하기 좋습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rise-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Poker Pace</p>
          <h1 className="font-display mt-3 max-w-[11ch] text-[1.9rem] font-bold leading-[1.18]">
            오늘은 한 손만 더 좋은 결정을 만듭니다.
          </h1>
        </div>
        <ProgressRing percent={percent} />
      </div>

      <div className="table-panel rounded-[1.2rem] p-5">
        <div className="relative flex items-center justify-between gap-3">
          <p className="eyebrow">
            {unit.week}주차 {unit.day}일차
          </p>
          <span className="chip px-2.5 py-1 text-xs font-bold">
            {unit.estimatedMinutes}분
          </span>
        </div>
        <h2 className="font-display relative mt-6 text-2xl font-bold">
          {unit.title}
        </h2>
        <p className="relative mt-3 text-sm leading-7 text-[var(--ink-300)]">
          {unit.goal}
        </p>
        <dl className="relative mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold text-[var(--ink-300)]">
          <div className="border-y border-[oklch(86%_0.018_94_/_0.11)] py-3">
            <dt>레슨</dt>
            <dd className="mt-1 text-[var(--mint-400)]">짧게</dd>
          </div>
          <div className="border-y border-[oklch(86%_0.018_94_/_0.11)] py-3">
            <dt>퀴즈</dt>
            <dd className="mt-1 text-[var(--mint-400)]">
              {unit.quizIds.length}
            </dd>
          </div>
          <div className="border-y border-[oklch(86%_0.018_94_/_0.11)] py-3">
            <dt>코스</dt>
            <dd className="mt-1 text-[var(--mint-400)]">
              {completedCount}/{totalCount}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => onStartLesson(unit.id)}
          className="primary-action relative mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-[0.85rem] px-4 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:brightness-105 active:translate-y-px"
        >
          학습 시작
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </section>
  );
}
