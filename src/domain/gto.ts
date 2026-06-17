import type { GtoActionMix, GtoHandStrategy, GtoSpot } from './types';

export const handRanks = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

export const handSuits = handRanks;

const strongRanks = new Set(['A', 'K', 'Q', 'J']);
const playablePairs = new Set(['A', 'K', 'Q', 'J', 'T', '9', '8', '7']);

const getHandId = (row: string, column: string) => {
  if (row === column) {
    return `${row}${column}`;
  }

  const rowIndex = handRanks.indexOf(row);
  const columnIndex = handRanks.indexOf(column);
  return rowIndex < columnIndex ? `${row}${column}s` : `${column}${row}o`;
};

const getBaselineMix = (id: string): GtoActionMix => {
  const [first, second] = id;
  const suited = id.endsWith('s');
  const offsuit = id.endsWith('o');

  if (first === second) {
    return playablePairs.has(first)
      ? { raise: 82, call: 14, fold: 4 }
      : { raise: 35, call: 38, fold: 27 };
  }

  if (suited && first === 'A') {
    return strongRanks.has(second)
      ? { raise: 76, call: 18, fold: 6 }
      : { raise: 52, call: 24, fold: 24 };
  }

  if (suited && strongRanks.has(first) && strongRanks.has(second)) {
    return { raise: 68, call: 24, fold: 8 };
  }

  if (suited) {
    return { raise: 28, call: 34, fold: 38 };
  }

  if (offsuit && first === 'A' && strongRanks.has(second)) {
    return { raise: 58, call: 26, fold: 16 };
  }

  if (offsuit && strongRanks.has(first) && strongRanks.has(second)) {
    return { raise: 38, call: 28, fold: 34 };
  }

  return { raise: 8, call: 12, fold: 80 };
};

const makeHand = (
  row: string,
  column: string,
  overrides: Partial<GtoHandStrategy> = {},
): GtoHandStrategy => {
  const id = getHandId(row, column);
  const baseline = getBaselineMix(id);

  return {
    id,
    ...baseline,
    note: '이 값은 solver 출력이 아니라 초보 학습용으로 단순화한 기준선입니다.',
    exploit:
      '상대가 너무 타이트하면 공격 빈도를 올리고, 리레이즈가 많으면 낮춥니다.',
    ...overrides,
  };
};

const makeHands = (
  overrides: Record<string, Partial<GtoHandStrategy>>,
): GtoHandStrategy[] =>
  handRanks.flatMap((row) =>
    handSuits.map((column) => {
      const id = getHandId(row, column);
      return makeHand(row, column, overrides[id]);
    }),
  );

export const gtoSpots: GtoSpot[] = [
  {
    id: 'btn-open-40bb',
    title: 'BTN open',
    format: 'Tournament',
    stackDepth: '40BB',
    position: 'Button',
    description:
      '버튼에서 모두 폴드된 상황입니다. 포지션 이점 때문에 넓게 열되, 블라인드 성향에 따라 조정합니다.',
    hands: makeHands({
      AJs: {
        raise: 70,
        call: 20,
        fold: 10,
        note: 'AJs는 버튼에서 강한 오픈 후보입니다. 콜보다 레이즈로 블라인드를 압박하는 쪽이 기본입니다.',
        exploit:
          '블라인드가 너무 타이트하면 오픈 빈도를 높이고, 3-bet이 잦으면 콜/폴드 쪽으로 낮춥니다.',
      },
      K9o: {
        raise: 22,
        call: 10,
        fold: 68,
        exploit:
          '블라인드가 수동적이면 일부 오픈할 수 있지만, 공격적인 상대에게는 줄입니다.',
      },
      '72o': {
        raise: 2,
        call: 0,
        fold: 98,
        exploit: '상대가 극단적으로 과폴드하지 않는 한 폴드가 기본입니다.',
      },
    }),
  },
  {
    id: 'bb-defend-btn-40bb',
    title: 'BB defend vs BTN',
    format: 'Tournament',
    stackDepth: '40BB',
    position: 'Big blind',
    description:
      '버튼 오픈을 빅블라인드에서 받는 상황입니다. 가격이 좋지만 포지션이 없으므로 약한 오프수트는 줄입니다.',
    hands: makeHands({
      AJs: {
        raise: 28,
        call: 62,
        fold: 10,
        note: 'AJs는 콜과 일부 3-bet을 섞기 좋은 핸드입니다.',
        exploit:
          '버튼이 너무 넓게 열면 3-bet을 늘리고, 강한 핸드만 열면 콜 비중을 낮춥니다.',
      },
    }),
  },
  {
    id: 'co-vs-3bet-40bb',
    title: 'CO vs blind 3-bet',
    format: 'Tournament',
    stackDepth: '40BB',
    position: 'Cutoff',
    description:
      '컷오프 오픈 후 블라인드에게 3-bet을 받은 상황입니다. 콜 가능한 핸드와 버릴 핸드를 구분합니다.',
    hands: makeHands({
      AJs: {
        raise: 18,
        call: 55,
        fold: 27,
        note: 'AJs는 상대 3-bet 범위가 넓을 때 방어할 수 있지만, 무리한 4-bet은 피합니다.',
        exploit:
          '상대가 블러프 3-bet을 거의 하지 않으면 폴드 쪽으로 기울입니다.',
      },
    }),
  },
];
