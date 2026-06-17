import { ArrowLeft, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { quizzes } from '../domain/course';
import type { CourseUnit, QuizAnswerRecord } from '../domain/types';
import { guideEntries } from './GuideScreen';

type LessonScreenProps = {
  unit: CourseUnit;
  onBack: () => void;
  onAnswer: (answer: QuizAnswerRecord) => void;
  onComplete: (unitId: string) => void;
  onOpenGuideTerm?: (term: string) => void;
};

const quizTypeLabels = {
  decision: '판단',
  reading: '읽기',
} as const;

const cardTokenPattern = /[AKQJT98765432][♠♥♦♣]/g;
const cardSequencePattern =
  /[AKQJT98765432][♠♥♦♣](?:\s+[AKQJT98765432][♠♥♦♣])*/;
const skippedGuideLabels = new Set(['s', 'o', 't', 'aa', 'kk', '77']);

const guideLinkCandidates = guideEntries
  .filter((entry) => entry.category !== '족보')
  .flatMap((entry) =>
    [entry.term, ...entry.aliases].map((label) => ({
      label,
      normalizedLabel: label.toLocaleLowerCase(),
      term: entry.term,
    })),
  )
  .filter(
    (candidate, index, candidates) =>
      candidate.label.length >= 2 &&
      !skippedGuideLabels.has(candidate.normalizedLabel) &&
      candidates.findIndex(
        (other) => other.normalizedLabel === candidate.normalizedLabel,
      ) === index,
  )
  .sort((first, second) => second.label.length - first.label.length);

type CardGroup = {
  label: '내 패' | '커뮤니티 카드' | '카드';
  cards: string[];
};

const getCardTokens = (text: string) => text.match(cardTokenPattern) ?? [];

const getCardGroup = (
  text: string,
  label: '내 패' | '커뮤니티 카드',
  pattern: RegExp,
): CardGroup | null => {
  const match = text.match(pattern);
  const cards = match ? getCardTokens(match[1]) : [];

  return cards.length > 0 ? { label, cards } : null;
};

const isCardGroup = (group: CardGroup | null): group is CardGroup =>
  group !== null;

const getCardGroups = (text: string): CardGroup[] => {
  const holeCards = getCardGroup(
    text,
    '내 패',
    new RegExp(`내 패(?:는)?\\s*(${cardSequencePattern.source})`),
  );
  const communityCards = getCardGroup(
    text,
    '커뮤니티 카드',
    new RegExp(`(?:커뮤니티 카드|보드)\\s*(${cardSequencePattern.source})`),
  );
  const groupedCards = [holeCards, communityCards].filter(isCardGroup);

  if (groupedCards.length > 0) {
    return groupedCards;
  }

  const cards = getCardTokens(text);

  return cards.length > 0 ? [{ label: '카드', cards }] : [];
};

type CardGroupsProps = {
  groups: CardGroup[];
  sourceLabel: '문제' | '해설';
};

type GuideMatch = {
  index: number;
  label: string;
  term: string;
};

const isTokenChar = (value: string) => /[\p{L}\p{N}]/u.test(value);

const hasGuideTermBoundary = (text: string, index: number, length: number) => {
  const before = text[index - 1];
  const after = text[index + length];

  return (!before || !isTokenChar(before)) && (!after || !isTokenChar(after));
};

const findNextGuideMatch = (text: string): GuideMatch | null => {
  const normalizedText = text.toLocaleLowerCase();

  return guideLinkCandidates.reduce<GuideMatch | null>((current, candidate) => {
    let index = normalizedText.indexOf(candidate.normalizedLabel);

    while (
      index !== -1 &&
      !hasGuideTermBoundary(text, index, candidate.label.length)
    ) {
      index = normalizedText.indexOf(candidate.normalizedLabel, index + 1);
    }

    if (index === -1) {
      return current;
    }

    if (
      !current ||
      index < current.index ||
      (index === current.index && candidate.label.length > current.label.length)
    ) {
      return {
        index,
        label: text.slice(index, index + candidate.label.length),
        term: candidate.term,
      };
    }

    return current;
  }, null);
};

function TextWithGuideLinks({
  text,
  onOpenGuideTerm,
}: {
  text: string;
  onOpenGuideTerm?: (term: string) => void;
}) {
  if (!onOpenGuideTerm) {
    return text;
  }

  const segments: Array<
    | { type: 'text'; value: string }
    | { type: 'term'; value: string; term: string }
  > = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    const match = findNextGuideMatch(remainingText);

    if (!match) {
      segments.push({ type: 'text', value: remainingText });
      break;
    }

    if (match.index > 0) {
      segments.push({
        type: 'text',
        value: remainingText.slice(0, match.index),
      });
    }

    segments.push({ type: 'term', value: match.label, term: match.term });
    remainingText = remainingText.slice(match.index + match.label.length);
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === 'text' ? (
          <span key={`${segment.value}-${index}`}>{segment.value}</span>
        ) : (
          <button
            key={`${segment.term}-${segment.value}-${index}`}
            type="button"
            aria-label={`${segment.value} 용어 보기`}
            onClick={() => onOpenGuideTerm(segment.term)}
            className="inline rounded-[0.35rem] px-1 font-black text-[var(--mint-400)] underline decoration-[var(--mint-400)]/50 underline-offset-4 transition hover:bg-[oklch(86%_0.018_94_/_0.08)]"
          >
            {segment.value}
          </button>
        ),
      )}
    </>
  );
}

function CardGroups({ groups, sourceLabel }: CardGroupsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-4 space-y-3">
      {groups.map((group) => (
        <section
          key={`${sourceLabel}-${group.label}`}
          aria-label={`${sourceLabel} ${group.label}${group.label.endsWith('카드') ? '' : ' 카드'}`}
          className="rounded-[0.8rem] border border-[oklch(86%_0.018_94_/_0.1)] bg-[oklch(9%_0.016_165_/_0.38)] p-3"
        >
          <p className="mb-2 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[var(--clay-300)]">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.cards.map((token, index) => (
              <Card key={`${group.label}-${token}-${index}`} value={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function LessonScreen({
  unit,
  onBack,
  onAnswer,
  onComplete,
  onOpenGuideTerm,
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
  const promptCardGroups = quiz ? getCardGroups(quiz.prompt) : [];
  const explanationCardGroups = quiz
    ? getCardGroups(`${quiz.prompt} ${quiz.explanation}`)
    : [];

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
    <section className="rise-in space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="chip flex items-center gap-2 px-3 py-2 text-sm font-bold transition hover:bg-[oklch(86%_0.018_94_/_0.06)]"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        뒤로
      </button>

      <div>
        <p className="eyebrow">
          {unit.week}주차 {unit.day}일차
        </p>
        <h1 className="font-display mt-3 text-[2rem] font-bold leading-tight">
          {unit.title}
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          {unit.goal}
        </p>
      </div>

      {phase === 'lesson' ? (
        <div className="space-y-3">
          {unit.lessonBlocks.map((block) => (
            <article
              key={block.heading}
              className="surface rounded-[1.1rem] p-5"
            >
              <h2 className="font-display text-lg font-bold">
                {block.heading}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-300)]">
                {block.body}
              </p>
            </article>
          ))}
          <button
            type="button"
            onClick={() => setPhase('quiz')}
            className="primary-action min-h-14 w-full rounded-[0.85rem] px-4 text-sm font-black uppercase tracking-[0.12em] transition hover:brightness-105 active:translate-y-px"
          >
            퀴즈 시작
          </button>
        </div>
      ) : null}

      {phase === 'quiz' && quiz ? (
        <section
          aria-live="polite"
          className="table-panel rounded-[1.2rem] p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="chip relative px-3 py-1 text-xs font-bold">
              문제 {quizIndex + 1}/{unitQuizzes.length}
            </span>
            <span className="chip relative px-3 py-1 text-xs font-bold text-[var(--mint-400)]">
              {quizTypeLabels[quiz.type]}
            </span>
          </div>
          <p className="relative mt-6 text-sm font-bold leading-7 text-[var(--ink-300)]">
            <TextWithGuideLinks
              text={quiz.context}
              onOpenGuideTerm={onOpenGuideTerm}
            />
          </p>
          <h2 className="font-display relative mt-2 text-xl font-bold leading-8">
            <TextWithGuideLinks
              text={quiz.prompt}
              onOpenGuideTerm={onOpenGuideTerm}
            />
          </h2>
          <CardGroups groups={promptCardGroups} sourceLabel="문제" />
          <fieldset
            aria-label="퀴즈 선택지"
            className="relative mt-6 space-y-2"
          >
            {quiz.choices.map((choice) => {
              const selected = selectedChoiceId === choice.id;
              const correct = choice.id === quiz.correctChoiceId;

              return (
                <button
                  key={choice.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => finishAnswer(choice.id)}
                  className={`flex min-h-13 w-full items-center justify-between rounded-[0.85rem] border px-4 py-3 text-left text-sm font-black transition duration-200 active:translate-y-px ${
                    selected
                      ? correct
                        ? 'border-[oklch(74%_0.115_166)] bg-[var(--mint-400)] text-[var(--felt-950)]'
                        : 'border-[oklch(67%_0.16_24)] bg-[var(--danger-400)] text-[var(--felt-950)]'
                      : 'border-[oklch(86%_0.018_94_/_0.12)] bg-[oklch(14%_0.02_165_/_0.7)] text-[var(--ink-100)] hover:bg-[oklch(86%_0.018_94_/_0.07)]'
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
          </fieldset>
          {selectedChoiceId ? (
            <div
              aria-live="polite"
              className="surface relative mt-5 rounded-[0.95rem] p-4"
            >
              <p className="eyebrow">해설</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-200)]">
                <TextWithGuideLinks
                  text={quiz.explanation}
                  onOpenGuideTerm={onOpenGuideTerm}
                />
              </p>
              <section aria-label="해설 카드 예시">
                <CardGroups groups={explanationCardGroups} sourceLabel="해설" />
              </section>
              <button
                type="button"
                onClick={nextQuiz}
                className="mt-4 min-h-12 w-full rounded-[0.75rem] bg-[var(--ink-100)] px-4 text-sm font-black text-[var(--felt-950)] transition hover:brightness-95 active:translate-y-px"
              >
                {quizIndex + 1 >= unitQuizzes.length
                  ? '학습 완료'
                  : '다음 문제'}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {phase === 'done' ? (
        <div className="surface rounded-[1.1rem] p-6">
          <p className="eyebrow">학습 완료</p>
          <h2 className="font-display mt-3 text-2xl font-bold leading-tight">
            좋습니다. 바로 다음 학습으로 이어가면 됩니다.
          </h2>
          <button
            type="button"
            onClick={onBack}
            className="primary-action mt-5 min-h-12 w-full rounded-[0.75rem] px-4 text-sm font-black uppercase tracking-[0.12em]"
          >
            이어가기
          </button>
        </div>
      ) : null}
    </section>
  );
}
