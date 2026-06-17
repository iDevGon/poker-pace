import { BookOpen, Dumbbell, ListChecks, Sparkles } from 'lucide-react';

export type TabId = 'today' | 'course' | 'trainer' | 'tournament';

type BottomTabsProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

const tabs = [
  { id: 'today', label: 'Today', icon: Sparkles },
  { id: 'course', label: 'Course', icon: BookOpen },
  { id: 'trainer', label: 'Trainer', icon: Dumbbell },
  { id: 'tournament', label: 'Tournament', icon: ListChecks },
] satisfies Array<{ id: TabId; label: string; icon: typeof Sparkles }>;

export function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[oklch(86%_0.018_94_/_0.12)] bg-[oklch(12%_0.015_165_/_0.94)] px-3 pb-3 pt-2 backdrop-blur"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-[1rem] text-[11px] font-bold transition duration-200 active:translate-y-px ${
                active
                  ? 'primary-action'
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
