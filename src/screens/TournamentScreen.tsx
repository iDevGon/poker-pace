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
    <section className="space-y-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
          Tournament
        </p>
        <h1 className="mt-3 text-3xl font-black">친구 대회 체크리스트</h1>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          당일 운영 앱이 아니라, 시작 전에 친구들과 합의할 항목만 놓치지 않게
          정리합니다.
        </p>
      </div>

      <div className="rounded-[2rem] border border-amber-200/30 bg-amber-200/10 p-5">
        <div className="flex items-center gap-3">
          <CheckSquare2 aria-hidden="true" className="size-6 text-amber-200" />
          <div>
            <p className="text-sm font-black text-amber-100">
              {doneCount}/{tournamentChecklistItems.length} decided
            </p>
            <p className="text-xs font-bold text-stone-300">
              룰은 시작 전에 정해야 게임 중 말이 줄어듭니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {tournamentChecklistItems.map((item) => (
          <label
            key={item.id}
            className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4"
          >
            <input
              type="checkbox"
              checked={Boolean(checklist[item.id])}
              onChange={() => onToggleItem(item.id)}
              className="mt-1 size-5 accent-emerald-300"
            />
            <span>
              <span className="block text-sm font-black text-stone-100">
                {item.label}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-stone-400">
                {item.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
