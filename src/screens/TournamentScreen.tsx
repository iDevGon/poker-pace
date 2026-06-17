import { CheckSquare2 } from 'lucide-react';
import { tournamentChecklistItems } from '../domain/course';

type TournamentScreenProps = {
  checklist: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
};

export function TournamentScreen({
  checklist,
  onToggleItem,
}: TournamentScreenProps) {
  const doneCount = tournamentChecklistItems.filter(
    (item) => checklist[item.id],
  ).length;

  return (
    <section className="rise-in space-y-6">
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-[var(--mint-400)]">
          Tournament
        </p>
        <h1 className="font-display mt-3 text-[2rem] font-black leading-tight">
          친구 대회 체크리스트
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          당일 운영 앱이 아니라, 시작 전에 친구들과 합의할 항목만 놓치지 않게
          정리합니다.
        </p>
      </div>

      <div className="table-panel rounded-[2rem] p-5">
        <div className="flex items-center gap-3">
          <CheckSquare2
            aria-hidden="true"
            className="relative size-6 text-[var(--clay-300)]"
          />
          <div className="relative">
            <p className="font-display text-sm font-black text-[var(--clay-300)]">
              {doneCount}/{tournamentChecklistItems.length} decided
            </p>
            <p className="text-xs font-bold text-[var(--ink-300)]">
              룰은 시작 전에 정해야 게임 중 말이 줄어듭니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {tournamentChecklistItems.map((item) => (
          <label
            key={item.id}
            className="surface flex gap-3 rounded-[1.5rem] p-4 transition hover:bg-[oklch(86%_0.018_94_/_0.06)]"
          >
            <input
              type="checkbox"
              checked={Boolean(checklist[item.id])}
              onChange={() => onToggleItem(item.id)}
              className="mt-1 size-5 accent-[var(--mint-400)]"
            />
            <span>
              <span className="block text-sm font-black text-[var(--ink-100)]">
                {item.label}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-[var(--ink-300)]">
                {item.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
