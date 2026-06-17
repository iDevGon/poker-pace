import { useEffect, useMemo, useState } from 'react';
import { BottomTabs, type TabId } from './components/BottomTabs';
import { courseUnits } from './domain/course';
import {
  completeUnit,
  getCompletionPercent,
  getNextRecommendedUnit,
  initialProgress,
  recordQuizAnswer,
} from './domain/progress';
import { loadProgress, saveProgress } from './domain/storage';
import type { ProgressState, QuizAnswerRecord } from './domain/types';
import { CourseScreen } from './screens/CourseScreen';
import { LessonScreen } from './screens/LessonScreen';
import { TodayScreen } from './screens/TodayScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window === 'undefined') {
      return initialProgress;
    }
    return loadProgress();
  });

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const recommendedUnit = useMemo(
    () => getNextRecommendedUnit(courseUnits, progress),
    [progress],
  );
  const activeUnit = activeUnitId
    ? (courseUnits.find((unit) => unit.id === activeUnitId) ?? null)
    : null;
  const completionPercent = getCompletionPercent(courseUnits, progress);

  const openLesson = (unitId: string) => {
    setActiveUnitId(unitId);
  };

  const closeLesson = () => {
    setActiveUnitId(null);
  };

  const answerQuiz = (answer: QuizAnswerRecord) => {
    setProgress((current) => recordQuizAnswer(current, answer));
  };

  const finishUnit = (unitId: string) => {
    setProgress((current) => completeUnit(current, unitId));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#166534_0%,#0c0a09_34%,#0c0a09_100%)] text-stone-50">
      <div className="mx-auto min-h-screen w-full max-w-md border-x border-white/10 bg-stone-950/86 px-5 pb-28 pt-6 shadow-2xl shadow-black">
        {activeUnit ? (
          <LessonScreen
            unit={activeUnit}
            onBack={closeLesson}
            onAnswer={answerQuiz}
            onComplete={finishUnit}
          />
        ) : (
          <>
            {activeTab === 'today' ? (
              <TodayScreen
                unit={recommendedUnit}
                percent={completionPercent}
                completedCount={progress.completedUnitIds.length}
                totalCount={courseUnits.length}
                onStartLesson={openLesson}
              />
            ) : null}
            {activeTab === 'course' ? (
              <CourseScreen
                units={courseUnits}
                completedUnitIds={progress.completedUnitIds}
                recommendedUnitId={recommendedUnit?.id ?? null}
                onOpenUnit={openLesson}
              />
            ) : null}
            {activeTab === 'trainer' ? (
              <section>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
                  Trainer
                </p>
                <h1 className="mt-3 text-3xl font-black">퀴즈 복습</h1>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  틀린 문제와 랜덤 퀴즈는 다음 단계에서 연결합니다.
                </p>
              </section>
            ) : null}
            {activeTab === 'tournament' ? (
              <section>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
                  Tournament
                </p>
                <h1 className="mt-3 text-3xl font-black">
                  친구 대회 체크리스트
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  대회 규칙 체크리스트는 다음 단계에서 연결합니다.
                </p>
              </section>
            ) : null}
          </>
        )}
      </div>
      {!activeUnit ? (
        <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
      ) : null}
    </main>
  );
}
