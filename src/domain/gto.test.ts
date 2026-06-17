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
        '블라인드가 너무 타이트하면 오픈 빈도를 높이고, 3-bet이 잦으면 콜/폴드 쪽으로 낮춥니다.',
    });
  });

  it('provides common preflop spots grouped by category', () => {
    expect(gtoSpots).toHaveLength(8);
    expect(new Set(gtoSpots.map((spot) => spot.category))).toEqual(
      new Set(['Open', 'Defend', 'Vs 3-bet']),
    );

    expect(gtoSpots.map((spot) => spot.id)).toEqual(
      expect.arrayContaining([
        'utg-open-40bb',
        'co-open-40bb',
        'sb-open-bb-40bb',
        'bb-defend-co-40bb',
        'btn-vs-3bet-40bb',
      ]),
    );

    for (const spot of gtoSpots) {
      expect(spot.hands).toHaveLength(169);
    }
  });
});
