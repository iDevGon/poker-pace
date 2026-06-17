import { CheckCircle2, Circle } from 'lucide-react';
import type { CourseUnit } from '../domain/types';

type CourseScreenProps = {
  units: CourseUnit[];
  completedUnitIds: string[];
  recommendedUnitId: string | null;
  onOpenUnit: (unitId: string) => void;
};

export function CourseScreen({
  units,
  completedUnitIds,
  recommendedUnitId,
  onOpenUnit,
}: CourseScreenProps) {
  const weeks = [1, 2, 3, 4];

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
          Course
        </p>
        <h1 className="mt-3 text-3xl font-black">4주 로드맵</h1>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          권장 순서는 표시하지만 잠금은 없습니다. 오늘 더 풀고 싶으면 바로
          이어가세요.
        </p>
      </div>

      {weeks.map((week) => (
        <div
          key={week}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
        >
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
            Week {week}
          </h2>
          <div className="mt-3 space-y-2">
            {units
              .filter((unit) => unit.week === week)
              .map((unit) => {
                const complete = completedUnitIds.includes(unit.id);
                const recommended = recommendedUnitId === unit.id;

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => onOpenUnit(unit.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      recommended
                        ? 'border-emerald-300/70 bg-emerald-300/10'
                        : 'border-white/10 bg-stone-950/40 hover:bg-white/5'
                    }`}
                  >
                    {complete ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-5 text-emerald-300"
                      />
                    ) : (
                      <Circle
                        aria-hidden="true"
                        className="size-5 text-stone-500"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                        Day {unit.day}
                      </p>
                      <p className="truncate text-sm font-black text-stone-100">
                        {unit.title}
                      </p>
                    </div>
                    {recommended ? (
                      <span className="rounded-full bg-emerald-300 px-2 py-1 text-[10px] font-black uppercase text-stone-950">
                        Next
                      </span>
                    ) : null}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </section>
  );
}
