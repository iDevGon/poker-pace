import { ArrowLeft, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { quizzes } from '../domain/course';
import type { CourseUnit, QuizAnswerRecord } from '../domain/types';

type LessonScreenProps = {
  unit: CourseUnit;
  onBack: () => void;
  onAnswer: (answer: QuizAnswerRecord) => void;
  onComplete: (unitId: string) => void;
};

export function LessonScreen({
  unit,
  onBack,
  onAnswer,
  onComplete,
}: LessonScreenProps) {
  const [phase, setPhase] = useState<'lesson' | 'quiz' | 'done'>('lesson');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const unitQuizzes = useMemo(
    () =>
      unit.quizIds
        .map((quizId) => quizzes.find((quiz) => quiz.id === quizId))
        .filter((quiz) => Boolean(quiz)),
    [unit.quizIds],
  );
  const quiz = unitQuizzes[quizIndex];

  const finishAnswer = (choiceId: string) => {
    if (!quiz || selectedChoiceId) {
      return;
    }

    setSelectedChoiceId(choiceId);
    onAnswer({
      quizId: quiz.id,
      selectedChoiceId: choiceId,
      correct: choiceId === quiz.correctChoiceId,
    });
  };

  const nextQuiz = () => {
    if (quizIndex + 1 >= unitQuizzes.length) {
      onComplete(unit.id);
      setPhase('done');
      return;
    }
    setQuizIndex((current) => current + 1);
    setSelectedChoiceId(null);
  };

  return (
    <section className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-stone-300"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </button>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
          Week {unit.week} Day {unit.day}
        </p>
        <h1 className="mt-3 text-3xl font-black">{unit.title}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-300">{unit.goal}</p>
      </div>

      {phase === 'lesson' ? (
        <div className="space-y-3">
          {unit.lessonBlocks.map((block) => (
            <article
              key={block.heading}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >
              <h2 className="text-lg font-black">{block.heading}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                {block.body}
              </p>
            </article>
          ))}
          <button
            type="button"
            onClick={() => setPhase('quiz')}
            className="min-h-14 w-full rounded-2xl bg-amber-200 px-4 text-sm font-black uppercase tracking-[0.16em] text-stone-950"
          >
            Begin quiz
          </button>
        </div>
      ) : null}

      {phase === 'quiz' && quiz ? (
        <div className="rounded-[2rem] border border-white/10 bg-stone-900 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-stone-300">
              Question {quizIndex + 1}/{unitQuizzes.length}
            </span>
            <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
              {quiz.type}
            </span>
          </div>
          <p className="mt-5 text-sm font-bold leading-6 text-stone-300">
            {quiz.context}
          </p>
          <h2 className="mt-2 text-xl font-black leading-7">{quiz.prompt}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {quiz.prompt
              .split(/[\s,]+/)
              .filter((token) => /[AKQJT98765432][♠♥♦♣]/.test(token))
              .map((token) => (
                <Card key={token} value={token} />
              ))}
          </div>
          <div className="mt-5 space-y-2">
            {quiz.choices.map((choice) => {
              const selected = selectedChoiceId === choice.id;
              const correct = choice.id === quiz.correctChoiceId;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => finishAnswer(choice.id)}
                  className={`flex min-h-13 w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                    selected
                      ? correct
                        ? 'border-emerald-300 bg-emerald-300 text-stone-950'
                        : 'border-red-300 bg-red-300 text-stone-950'
                      : 'border-white/10 bg-white/[0.04] text-stone-100 hover:bg-white/10'
                  }`}
                >
                  {choice.label}
                  {selected && correct ? (
                    <Check aria-hidden="true" className="size-5" />
                  ) : null}
                  {selected && !correct ? (
                    <X aria-hidden="true" className="size-5" />
                  ) : null}
                </button>
              );
            })}
          </div>
          {selectedChoiceId ? (
            <div className="mt-5 rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                Explanation
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                {quiz.explanation}
              </p>
              <button
                type="button"
                onClick={nextQuiz}
                className="mt-4 min-h-12 w-full rounded-xl bg-stone-100 px-4 text-sm font-black text-stone-950"
              >
                {quizIndex + 1 >= unitQuizzes.length
                  ? 'Complete unit'
                  : 'Next question'}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === 'done' ? (
        <div className="rounded-[2rem] border border-emerald-300/30 bg-emerald-300/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-200">
            Unit complete
          </p>
          <h2 className="mt-3 text-2xl font-black">
            좋습니다. 바로 다음 학습으로 이어갈 수 있습니다.
          </h2>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 min-h-12 w-full rounded-xl bg-emerald-300 px-4 text-sm font-black uppercase tracking-[0.14em] text-stone-950"
          >
            Continue
          </button>
        </div>
      ) : null}
    </section>
  );
}
