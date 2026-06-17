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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-stone-950/90 px-3 pb-3 pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-xl text-[11px] font-bold transition ${
                active
                  ? 'bg-emerald-300 text-stone-950'
                  : 'text-stone-400 hover:bg-white/5 hover:text-stone-100'
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
