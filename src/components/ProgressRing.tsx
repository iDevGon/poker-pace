import type { CSSProperties } from 'react';

type ProgressRingProps = {
  percent: number;
};

export function ProgressRing({ percent }: ProgressRingProps) {
  return (
    <div
      aria-label="Course progress"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percent}
      className="grid size-16 place-items-center rounded-full border border-[oklch(82%_0.085_55_/_0.34)] bg-[conic-gradient(from_180deg,var(--clay-300)_0deg,var(--clay-500)_var(--progress-angle),oklch(24%_0.035_165)_0deg)] p-1"
      role="progressbar"
      style={{ '--progress-angle': `${percent * 3.6}deg` } as CSSProperties}
    >
      <div className="grid size-full place-items-center rounded-full bg-[var(--felt-950)] text-center">
        <div className="font-display text-lg font-black text-[var(--ink-100)]">
          {percent}%
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-300)]">
          done
        </div>
      </div>
    </div>
  );
}
