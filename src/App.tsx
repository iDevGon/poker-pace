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
} from './domain/progress';
import { loadProgress, saveProgress } from './domain/storage';
import type {
  CourseUnit,
  ProgressState,
  QuizAnswerRecord,
} from './domain/types';
import { CourseScreen } from './screens/CourseScreen';
import { GTOScreen } from './screens/GTOScreen';
import { GuideScreen } from './screens/GuideScreen';
import { LessonScreen } from './screens/LessonScreen';
import { TodayScreen } from './screens/TodayScreen';
import { TrainerScreen } from './screens/TrainerScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [trainerUnit, setTrainerUnit] = useState<CourseUnit | null>(null);
  const [guideTermFromQuiz, setGuideTermFromQuiz] = useState<string | null>(
    null,
  );
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
    setGuideTermFromQuiz(null);
    setTrainerUnit(null);
    setActiveUnitId(unitId);
  };

  const closeLesson = () => {
    setGuideTermFromQuiz(null);
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

  const startTrainerQuiz = (quizIds: string[]) => {
    const sessionUnit: CourseUnit = {
      id: 'trainer-session',
      week: 0,
      day: 0,
      title: quizIds.length === 1 ? '틀린 문제 복습' : '랜덤 10문제',
      goal: '빠르게 판단한 뒤 해설로 기준을 확인합니다.',
      estimatedMinutes: quizIds.length === 1 ? 2 : 10,
      lessonBlocks: [
        {
          heading: '복습',
          body: '이번 세션은 레슨 없이 바로 퀴즈로 시작합니다. 선택한 뒤 해설을 보며 기준을 정리하세요.',
        },
      ],
      quizIds,
    };
    setGuideTermFromQuiz(null);
    setTrainerUnit(sessionUnit);
    setActiveUnitId(sessionUnit.id);
  };

  return (
    <main className="min-h-screen text-[var(--ink-100)]">
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>
      <div
        id="main-content"
        className="app-shell mx-auto min-h-screen w-full max-w-md border-x border-[oklch(86%_0.018_94_/_0.1)] px-5 pb-28 pt-6"
      >
        {activeUnit ? (
          <>
            <div hidden={Boolean(guideTermFromQuiz)}>
              <LessonScreen
                unit={activeUnit}
                onBack={closeLesson}
                onAnswer={answerQuiz}
                onComplete={finishUnit}
                onOpenGuideTerm={setGuideTermFromQuiz}
              />
            </div>
            {guideTermFromQuiz ? (
              <GuideScreen
                targetTerm={guideTermFromQuiz}
                onReturnToQuestion={() => setGuideTermFromQuiz(null)}
              />
            ) : null}
          </>
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
            {activeTab === 'gto' ? <GTOScreen /> : null}
            {activeTab === 'guide' ? <GuideScreen /> : null}
          </>
        )}
      </div>
      {!activeUnit ? (
        <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
      ) : null}
    </main>
  );
}
