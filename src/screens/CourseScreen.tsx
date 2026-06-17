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
    <section className="rise-in space-y-6">
      <div>
        <p className="eyebrow">코스</p>
        <h1 className="font-display mt-3 text-[2rem] font-bold leading-tight">
          4주 로드맵
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          권장 순서는 표시하지만 잠금은 없습니다. 더 풀고 싶으면 바로 이어가면
          됩니다.
        </p>
      </div>

      {weeks.map((week) => (
        <section
          key={week}
          aria-labelledby={`week-${week}-heading`}
          className="surface rounded-[1.1rem] p-4"
        >
          <h2 id={`week-${week}-heading`} className="eyebrow">
            {week}주차
          </h2>
          <ul className="mt-4 space-y-2">
            {units
              .filter((unit) => unit.week === week)
              .map((unit) => {
                const complete = completedUnitIds.includes(unit.id);
                const recommended = recommendedUnitId === unit.id;

                return (
                  <li key={unit.id}>
                    <button
                      type="button"
                      aria-label={`${unit.title}, ${unit.week}주차 ${unit.day}일차${
                        complete ? ', 완료' : ''
                      }${recommended ? ', 다음 추천' : ''}`}
                      onClick={() => onOpenUnit(unit.id)}
                      className={`flex w-full items-center gap-3 rounded-[0.8rem] border p-3 text-left transition duration-200 active:translate-y-px ${
                        recommended
                          ? 'border-[oklch(82%_0.085_55_/_0.5)] bg-[oklch(64%_0.13_43_/_0.1)]'
                          : 'border-[oklch(86%_0.018_94_/_0.1)] bg-[oklch(13%_0.018_165_/_0.56)] hover:bg-[oklch(86%_0.018_94_/_0.06)]'
                      }`}
                    >
                      {complete ? (
                        <CheckCircle2
                          aria-hidden="true"
                          className="size-5 text-[var(--mint-400)]"
                        />
                      ) : (
                        <Circle
                          aria-hidden="true"
                          className="size-5 text-[oklch(55%_0.018_165)]"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xs font-bold uppercase tracking-widest text-[var(--ink-300)]">
                          {unit.day}일차
                        </p>
                        <p className="truncate text-sm font-black text-[var(--ink-100)]">
                          {unit.title}
                        </p>
                      </div>
                      {recommended ? (
                        <span className="primary-action rounded-full px-2 py-1 text-[10px] font-black uppercase">
                          다음
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </section>
  );
}
