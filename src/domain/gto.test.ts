import { describe, expect, it } from 'vitest';
import { gtoSpots, handRanks, handSuits } from './gto';

describe('gto reference data', () => {
  it('provides a tournament button open spot with a complete 13 by 13 hand grid', () => {
    const buttonOpen = gtoSpots.find((spot) => spot.id === 'btn-open-40bb');

    expect(buttonOpen?.title).toBe('BTN 오픈');
    expect(buttonOpen?.stackDepth).toBe('40BB');
    expect(handRanks).toHaveLength(13);
    expect(handSuits).toHaveLength(13);
    expect(buttonOpen?.hands).toHaveLength(169);
    expect(buttonOpen?.hands.find((hand) => hand.id === 'AJs')).toMatchObject({
      raise: 70,
      call: 20,
      fold: 10,
      exploit:
        '블라인드가 너무 타이트하면 오픈 빈도를 높이고, 3-bet이 잦으면 콜/폴드를 늘립니다.',
    });
    expect(buttonOpen?.hands.find((hand) => hand.id === 'ATo')).toMatchObject({
      raise: expect.any(Number),
    });
    expect(
      buttonOpen?.hands.find((hand) => hand.id === 'ATo')?.raise ?? 0,
    ).toBeGreaterThan(50);
  });

  it('keeps early position offsuit aces tighter than button opens', () => {
    const buttonOpen = gtoSpots.find((spot) => spot.id === 'btn-open-40bb');
    const utgOpen = gtoSpots.find((spot) => spot.id === 'utg-open-40bb');
    const buttonATo =
      buttonOpen?.hands.find((hand) => hand.id === 'ATo')?.raise ?? 0;
    const utgATo = utgOpen?.hands.find((hand) => hand.id === 'ATo')?.raise ?? 0;

    expect(buttonATo).toBeGreaterThan(utgATo + 25);
    expect(utgATo).toBeLessThan(35);
  });

  it('keeps big blind defense ranges from becoming all calls', () => {
    const defendButton = gtoSpots.find(
      (spot) => spot.id === 'bb-defend-btn-40bb',
    );

    expect(defendButton?.hands.find((hand) => hand.id === 'AA')).toMatchObject({
      raise: expect.any(Number),
    });
    expect(
      defendButton?.hands.find((hand) => hand.id === 'AA')?.raise ?? 0,
    ).toBeGreaterThan(50);
    expect(
      defendButton?.hands.find((hand) => hand.id === '72o')?.fold ?? 0,
    ).toBeGreaterThan(70);
    expect(
      defendButton?.hands.find((hand) => hand.id === 'K9o')?.call ?? 0,
    ).toBeGreaterThan(
      defendButton?.hands.find((hand) => hand.id === 'K9o')?.raise ?? 0,
    );
  });

  it('uses spot-aware default notes instead of one fixed exploit phrase', () => {
    const buttonOpen = gtoSpots.find((spot) => spot.id === 'btn-open-40bb');
    const bigBlindDefend = gtoSpots.find(
      (spot) => spot.id === 'bb-defend-btn-40bb',
    );
    const fixedExploit =
      '상대가 너무 타이트하면 공격 빈도를 올리고, 리레이즈가 많으면 낮춥니다.';

    expect(
      buttonOpen?.hands.find((hand) => hand.id === 'K8s')?.exploit,
    ).not.toBe(fixedExploit);
    expect(
      bigBlindDefend?.hands.find((hand) => hand.id === 'K8s')?.exploit,
    ).not.toBe(buttonOpen?.hands.find((hand) => hand.id === 'K8s')?.exploit);
  });

  it('provides common preflop spots grouped by category', () => {
    expect(gtoSpots.length).toBeGreaterThanOrEqual(13);
    expect(new Set(gtoSpots.map((spot) => spot.category))).toEqual(
      new Set(['Open', 'Defend', '3-bet', 'Vs 3-bet']),
    );

    expect(gtoSpots.map((spot) => spot.id)).toEqual(
      expect.arrayContaining([
        'utg-open-40bb',
        'lj-open-40bb',
        'hj-open-40bb',
        'co-open-40bb',
        'btn-open-40bb',
        'sb-open-bb-40bb',
        'bb-defend-utg-40bb',
        'bb-defend-hj-40bb',
        'bb-defend-btn-40bb',
        'bb-defend-co-40bb',
        'bb-defend-sb-40bb',
        'btn-3bet-vs-co-40bb',
        'sb-3bet-vs-btn-40bb',
        'bb-3bet-vs-btn-40bb',
        'bb-3bet-vs-sb-40bb',
        'utg-vs-btn-sb-3bet-40bb',
        'co-vs-btn-3bet-40bb',
        'btn-vs-sb-bb-3bet-40bb',
      ]),
    );

    for (const spot of gtoSpots) {
      expect(spot.hands).toHaveLength(169);
    }
  });
});
