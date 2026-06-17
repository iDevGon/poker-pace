import {
  BookOpen,
  Dumbbell,
  Grid3X3,
  ListChecks,
  TimerReset,
} from 'lucide-react';

export type TabId = 'today' | 'course' | 'trainer' | 'gto' | 'tournament';

type BottomTabsProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

const tabs = [
  { id: 'today', label: '오늘', icon: TimerReset },
  { id: 'course', label: '코스', icon: BookOpen },
  { id: 'trainer', label: '복습', icon: Dumbbell },
  { id: 'gto', label: 'GTO', icon: Grid3X3 },
  { id: 'tournament', label: '대회', icon: ListChecks },
] satisfies Array<{ id: TabId; label: string; icon: typeof TimerReset }>;

export function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
  return (
    <nav
      aria-label="주요 화면"
      className="bottom-nav fixed inset-x-0 bottom-0 z-20 border-t border-[oklch(86%_0.018_94_/_0.12)] bg-[oklch(12%_0.015_165_/_0.98)] px-3 pt-2"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-[0.8rem] text-[11px] font-bold transition duration-200 active:translate-y-px ${
                active
                  ? 'tab-active'
                  : 'text-[var(--ink-300)] hover:bg-[oklch(86%_0.018_94_/_0.06)] hover:text-[var(--ink-100)]'
              }`}
            >
              <Icon aria-hidden="true" className="mb-1 size-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
