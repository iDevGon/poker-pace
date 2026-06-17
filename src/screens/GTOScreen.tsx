import { Activity, Grid3X3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { gtoSpots, handRanks, handSuits } from '../domain/gto';
import type { GtoHandStrategy } from '../domain/types';

const actionColor = (hand: GtoHandStrategy) => {
  if (hand.raise >= hand.call && hand.raise >= hand.fold) {
    return 'bg-[var(--mint-400)] text-[var(--felt-950)]';
  }

  if (hand.call >= hand.fold) {
    return 'bg-[var(--clay-300)] text-[var(--felt-950)]';
  }

  return 'bg-[var(--danger-400)] text-[var(--felt-950)]';
};

const findHand = (hands: GtoHandStrategy[], handId: string) =>
  hands.find((hand) => hand.id === handId) ?? hands[0];

export function GTOScreen() {
  const [spotId, setSpotId] = useState(gtoSpots[0].id);
  const spot =
    gtoSpots.find((candidate) => candidate.id === spotId) ?? gtoSpots[0];
  const [selectedHandId, setSelectedHandId] = useState('AJs');
  const selectedHand = findHand(spot.hands, selectedHandId);
  const handsById = useMemo(
    () => new Map(spot.hands.map((hand) => [hand.id, hand])),
    [spot.hands],
  );

  const selectSpot = (nextSpotId: string) => {
    const nextSpot =
      gtoSpots.find((candidate) => candidate.id === nextSpotId) ?? gtoSpots[0];
    setSpotId(nextSpot.id);
    setSelectedHandId(findHand(nextSpot.hands, selectedHandId).id);
  };

  return (
    <section className="rise-in space-y-6">
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-[var(--mint-400)]">
          GTO
        </p>
        <h1 className="font-display mt-3 text-[2rem] font-black leading-tight">
          GTO Wizard Lite
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          상황별 기준 레인지를 빠르게 확인하고, 상대 성향에 맞춘 익스플로잇
          조정을 함께 봅니다.
        </p>
      </div>

      <div className="surface rounded-[1.5rem] p-3">
        <div className="grid grid-cols-1 gap-2">
          {gtoSpots.map((candidate) => {
            const active = candidate.id === spot.id;

            return (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={active}
                onClick={() => selectSpot(candidate.id)}
                className={`rounded-[1rem] border p-3 text-left transition active:translate-y-px ${
                  active
                    ? 'border-[oklch(82%_0.085_55_/_0.44)] bg-[oklch(64%_0.13_43_/_0.14)]'
                    : 'border-[oklch(86%_0.018_94_/_0.12)] bg-[oklch(13%_0.018_165_/_0.56)] hover:bg-[oklch(86%_0.018_94_/_0.06)]'
                }`}
              >
                <span className="block text-sm font-black text-[var(--ink-100)]">
                  {candidate.title}
                </span>
                <span className="mt-1 block text-xs font-bold text-[var(--ink-300)]">
                  {candidate.format} · {candidate.stackDepth} ·{' '}
                  {candidate.position}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="table-panel rounded-[1.5rem] p-4">
        <div className="relative flex items-start gap-3">
          <Grid3X3
            aria-hidden="true"
            className="mt-1 size-5 text-[var(--clay-300)]"
          />
          <div>
            <h2 className="font-display text-lg font-black">{spot.title}</h2>
            <p className="mt-1 text-xs font-bold leading-5 text-[var(--ink-300)]">
              {spot.description}
            </p>
          </div>
        </div>

        <fieldset className="relative mt-5 grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
          <legend className="sr-only">{spot.title} hand matrix</legend>
          {handRanks.flatMap((row) =>
            handSuits.map((column) => {
              const rowIndex = handRanks.indexOf(row);
              const columnIndex = handSuits.indexOf(column);
              const handId =
                row === column
                  ? `${row}${column}`
                  : rowIndex < columnIndex
                    ? `${row}${column}s`
                    : `${column}${row}o`;
              const hand = handsById.get(handId);
              const selected = selectedHand.id === handId;

              return (
                <button
                  key={`${row}-${column}`}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${handId} ${hand?.raise ?? 0}% raise, ${
                    hand?.call ?? 0
                  }% call, ${hand?.fold ?? 0}% fold`}
                  onClick={() => setSelectedHandId(handId)}
                  className={`aspect-square rounded-[0.34rem] text-[0.58rem] font-black transition active:scale-95 ${
                    hand ? actionColor(hand) : 'bg-[var(--felt-800)]'
                  } ${
                    selected
                      ? 'outline outline-2 outline-offset-2 outline-[var(--ink-100)]'
                      : 'opacity-86 hover:opacity-100'
                  }`}
                >
                  {handId}
                </button>
              );
            }),
          )}
        </fieldset>
      </section>

      <section aria-live="polite" className="surface rounded-[1.5rem] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Selected hand</p>
            <h2 className="font-display mt-2 text-3xl font-black">
              {selectedHand.id}
            </h2>
            <p className="mt-1 text-xs font-black text-[var(--ink-300)]">
              Raise {selectedHand.raise}% · Call {selectedHand.call}% · Fold{' '}
              {selectedHand.fold}%
            </p>
          </div>
          <Activity
            aria-hidden="true"
            className="size-8 text-[var(--mint-400)]"
          />
        </div>

        <div className="mt-5 overflow-hidden rounded-[0.8rem] border border-[oklch(86%_0.018_94_/_0.13)]">
          <div className="flex h-5 text-[0]">
            <div
              aria-hidden="true"
              className="bg-[var(--mint-400)]"
              style={{ width: `${selectedHand.raise}%` }}
            />
            <div
              aria-hidden="true"
              className="bg-[var(--clay-300)]"
              style={{ width: `${selectedHand.call}%` }}
            />
            <div
              aria-hidden="true"
              className="bg-[var(--danger-400)]"
              style={{ width: `${selectedHand.fold}%` }}
            />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
          <div className="rounded-[0.9rem] bg-[oklch(13%_0.018_165_/_0.62)] p-3">
            <dt className="text-[var(--ink-300)]">Raise</dt>
            <dd className="mt-1 text-[var(--mint-400)]">
              {selectedHand.raise}%
            </dd>
          </div>
          <div className="rounded-[0.9rem] bg-[oklch(13%_0.018_165_/_0.62)] p-3">
            <dt className="text-[var(--ink-300)]">Call</dt>
            <dd className="mt-1 text-[var(--clay-300)]">
              {selectedHand.call}%
            </dd>
          </div>
          <div className="rounded-[0.9rem] bg-[oklch(13%_0.018_165_/_0.62)] p-3">
            <dt className="text-[var(--ink-300)]">Fold</dt>
            <dd className="mt-1 text-[var(--danger-400)]">
              {selectedHand.fold}%
            </dd>
          </div>
        </dl>

        <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-200)]">
          <p>{selectedHand.note}</p>
          <p>
            <span className="font-black text-[var(--clay-300)]">Exploit:</span>{' '}
            {selectedHand.exploit}
          </p>
        </div>
      </section>
    </section>
  );
}
