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
    note: '이 값은 솔버 출력이 아니라 초보 학습에 맞춰 단순화한 기준선입니다.',
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
    category: 'Open',
    title: 'BTN 오픈',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '버튼',
    description:
      '버튼까지 모두 폴드된 상황입니다. 포지션 이점이 있으니 넓게 열고, 블라인드 성향에 맞춰 조정합니다.',
    hands: makeHands({
      AJs: {
        raise: 70,
        call: 20,
        fold: 10,
        note: 'AJs는 버튼에서 강한 오픈 후보입니다. 콜보다 레이즈로 블라인드를 압박하는 것이 기본입니다.',
        exploit:
          '블라인드가 너무 타이트하면 오픈 빈도를 높이고, 3-bet이 잦으면 콜/폴드를 늘립니다.',
      },
      K9o: {
        raise: 22,
        call: 10,
        fold: 68,
        exploit:
          '블라인드가 수동적이면 일부 오픈합니다. 공격적인 상대에게는 줄입니다.',
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
    id: 'utg-open-40bb',
    category: 'Open',
    title: 'UTG 오픈',
    format: '토너먼트',
    stackDepth: '40BB',
    position: 'UTG',
    description:
      '얼리 포지션에서 처음 여는 상황입니다. 뒤에 남은 플레이어가 많으므로 강한 핸드 중심으로 타이트하게 시작합니다.',
    hands: makeHands({
      AJs: {
        raise: 62,
        call: 22,
        fold: 16,
        note: 'AJs는 UTG에서도 열 수 있습니다. 다만 뒤 포지션 압박을 고려해 버튼보다 낮은 빈도로 봅니다.',
        exploit:
          '뒤 플레이어들이 너무 타이트하면 오픈 빈도를 조금 올리고, 3-bet이 많으면 낮춥니다.',
      },
      K9o: {
        raise: 4,
        call: 6,
        fold: 90,
        exploit: 'UTG에서는 약한 오프수트 브로드웨이를 무리해서 열지 않습니다.',
      },
      '72o': {
        raise: 0,
        call: 0,
        fold: 100,
        exploit: '얼리 포지션에서는 거의 항상 폴드합니다.',
      },
    }),
  },
  {
    id: 'co-open-40bb',
    category: 'Open',
    title: 'CO 오픈',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '컷오프',
    description:
      '컷오프까지 모두 폴드된 상황입니다. 버튼보다 조금 타이트하지만 스틸 가치는 충분합니다.',
    hands: makeHands({
      AJs: {
        raise: 68,
        call: 22,
        fold: 10,
        note: 'AJs는 컷오프에서 안정적인 오픈 후보입니다.',
        exploit:
          '버튼과 블라인드가 너무 타이트하면 오픈을 넓히고, 버튼이 자주 3-bet하면 줄입니다.',
      },
      K9o: {
        raise: 14,
        call: 10,
        fold: 76,
        exploit:
          '뒤 포지션이 수동적일 때만 일부 섞고, 공격적인 버튼이 있으면 폴드에 가깝게 둡니다.',
      },
    }),
  },
  {
    id: 'sb-open-bb-40bb',
    category: 'Open',
    title: 'SB 오픈 vs BB',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '스몰블라인드',
    description:
      '스몰블라인드에서 빅블라인드만 남은 상황입니다. 포지션은 없지만 상대가 한 명이라 넓게 공격합니다.',
    hands: makeHands({
      AJs: {
        raise: 72,
        call: 18,
        fold: 10,
        note: 'AJs는 스몰블라인드에서 강하게 열기 좋은 핸드입니다.',
        exploit:
          '빅블라인드가 과하게 방어하면 밸류 중심으로 조이고, 너무 많이 폴드하면 오픈 빈도를 높입니다.',
      },
      K9o: {
        raise: 34,
        call: 16,
        fold: 50,
        exploit:
          '상대가 패시브하면 오픈 후보가 됩니다. 자주 3-bet하면 낮춥니다.',
      },
    }),
  },
  {
    id: 'bb-defend-btn-40bb',
    category: 'Defend',
    title: 'BB 디펜스 vs BTN',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '빅블라인드',
    description:
      '빅블라인드에서 버튼 오픈을 받는 상황입니다. 가격은 좋지만 포지션이 없으므로 약한 오프수트는 줄입니다.',
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
    id: 'bb-defend-co-40bb',
    category: 'Defend',
    title: 'BB 디펜스 vs CO',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '빅블라인드',
    description:
      '컷오프 오픈을 빅블라인드에서 받는 상황입니다. 버튼 오픈보다 상대 범위가 강하므로 방어 범위를 조금 줄입니다.',
    hands: makeHands({
      AJs: {
        raise: 24,
        call: 58,
        fold: 18,
        note: 'AJs는 콜과 일부 3-bet을 섞습니다. 다만 버튼 상대보다 신중하게 봅니다.',
        exploit:
          '컷오프가 넓게 열면 3-bet을 늘리고, 타이트하면 콜과 폴드를 늘립니다.',
      },
      K9o: {
        raise: 6,
        call: 20,
        fold: 74,
        exploit:
          '상대 오픈이 넓고 사이즈가 작을 때만 일부 방어합니다. 기본은 폴드에 가깝습니다.',
      },
    }),
  },
  {
    id: 'co-vs-3bet-40bb',
    category: 'Vs 3-bet',
    title: 'CO vs 블라인드 3-bet',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '컷오프',
    description:
      '컷오프 오픈 후 블라인드에게 3-bet을 받은 상황입니다. 콜할 핸드와 버릴 핸드를 구분합니다.',
    hands: makeHands({
      AJs: {
        raise: 18,
        call: 55,
        fold: 27,
        note: 'AJs는 상대 3-bet 범위가 넓을 때 방어합니다. 무리한 4-bet은 피합니다.',
        exploit: '상대가 블러프 3-bet을 거의 하지 않으면 폴드를 우선합니다.',
      },
    }),
  },
  {
    id: 'btn-vs-3bet-40bb',
    category: 'Vs 3-bet',
    title: 'BTN vs 블라인드 3-bet',
    format: '토너먼트',
    stackDepth: '40BB',
    position: '버튼',
    description:
      '버튼 오픈 후 블라인드에게 3-bet을 받은 상황입니다. 버튼 오픈 범위가 넓으므로 계속할 핸드를 선별합니다.',
    hands: makeHands({
      AJs: {
        raise: 22,
        call: 58,
        fold: 20,
        note: 'AJs는 버튼에서 3-bet을 맞아도 계속할 수 있는 대표 핸드입니다.',
        exploit:
          '블라인드가 넓게 3-bet하면 콜과 4-bet 후보가 되고, 매우 타이트하면 콜 비중을 낮춥니다.',
      },
      K9o: {
        raise: 3,
        call: 12,
        fold: 85,
        exploit:
          '상대가 과하게 3-bet하지 않는 한 약한 오프수트는 버리는 편이 안정적입니다.',
      },
    }),
  },
];
