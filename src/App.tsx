import { useEffect, useMemo, useState } from 'react';
import { BottomTabs, type TabId } from './components/BottomTabs';
import { courseUnits } from './domain/course';
import {
  completeUnit,
  getCompletionPercent,
  getMissedQuizIds,
  getNextRecommendedUnit,
  initialProgress,
  recordQuizAnswer,
  toggleChecklistItem,
} from './domain/progress';
import { loadProgress, saveProgress } from './domain/storage';
import type {
  CourseUnit,
  ProgressState,
  QuizAnswerRecord,
} from './domain/types';
import { CourseScreen } from './screens/CourseScreen';
import { LessonScreen } from './screens/LessonScreen';
import { TodayScreen } from './screens/TodayScreen';
import { TournamentScreen } from './screens/TournamentScreen';
import { TrainerScreen } from './screens/TrainerScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [trainerUnit, setTrainerUnit] = useState<CourseUnit | null>(null);
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
  const activeUnit =
    trainerUnit ??
    (activeUnitId
      ? (courseUnits.find((unit) => unit.id === activeUnitId) ?? null)
      : null);
  const completionPercent = getCompletionPercent(courseUnits, progress);
  const missedQuizIds = getMissedQuizIds(progress);

  const openLesson = (unitId: string) => {
    setTrainerUnit(null);
    setActiveUnitId(unitId);
  };

  const closeLesson = () => {
    setActiveUnitId(null);
    setTrainerUnit(null);
  };

  const answerQuiz = (answer: QuizAnswerRecord) => {
    setProgress((current) => recordQuizAnswer(current, answer));
  };

  const finishUnit = (unitId: string) => {
    if (unitId !== 'trainer-session') {
      setProgress((current) => completeUnit(current, unitId));
    }
  };

  const toggleTournamentItem = (itemId: string) => {
    setProgress((current) => toggleChecklistItem(current, itemId));
  };

  const startTrainerQuiz = (quizIds: string[]) => {
    const sessionUnit: CourseUnit = {
      id: 'trainer-session',
      week: 0,
      day: 0,
      title: quizIds.length === 1 ? '틀린 문제 복습' : '랜덤 10문제',
      goal: '빠르게 판단하고 해설로 기준을 확인합니다.',
      estimatedMinutes: quizIds.length === 1 ? 2 : 10,
      lessonBlocks: [
        {
          heading: 'Trainer',
          body: '이번 세션은 레슨 없이 바로 퀴즈로 들어갑니다. 선택 후 해설을 보고 기준을 정리하세요.',
        },
      ],
      quizIds,
    };
    setTrainerUnit(sessionUnit);
    setActiveUnitId(sessionUnit.id);
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
              <TrainerScreen
                missedQuizIds={missedQuizIds}
                onStartQuiz={startTrainerQuiz}
              />
            ) : null}
            {activeTab === 'tournament' ? (
              <TournamentScreen
                checklist={progress.tournamentChecklist}
                onToggleItem={toggleTournamentItem}
              />
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
