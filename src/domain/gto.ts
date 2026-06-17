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

const strongRanks = new Set(['A', 'K', 'Q', 'J', 'T']);
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

type MixAdjustment = (mix: GtoActionMix, handId: string) => GtoActionMix;
type HandContext = Pick<GtoSpot, 'category' | 'title' | 'position'>;

const adjustMix =
  (raiseDelta: number, callDelta = 0): MixAdjustment =>
  (mix) => {
    const raise = Math.min(100, Math.max(0, mix.raise + raiseDelta));
    const call = Math.min(100 - raise, Math.max(0, mix.call + callDelta));

    return {
      raise,
      call,
      fold: 100 - raise - call,
    };
  };

const bbDefendButtonAdjust: MixAdjustment = (mix, handId) => {
  if (['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AQs', 'AKo'].includes(handId)) {
    return { raise: 62, call: 32, fold: 6 };
  }

  if (
    ['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o'].includes(handId)
  ) {
    return { raise: 0, call: 10, fold: 90 };
  }

  if (handId === 'K9o') {
    return { raise: 6, call: 38, fold: 56 };
  }

  if (mix.fold >= 70) {
    return { raise: 3, call: 28, fold: 69 };
  }

  return adjustMix(-22, 34)(mix, handId);
};

const getDefaultHandText = (
  handId: string,
  mix: GtoActionMix,
  context?: HandContext,
) => {
  const primaryAction =
    mix.raise >= mix.call && mix.raise >= mix.fold
      ? 'raise'
      : mix.call >= mix.fold
        ? 'call'
        : 'fold';
  const category = context?.category;
  const contextTitle = context?.title ?? '현재 상황';

  if (category === 'Open') {
    return {
      note:
        primaryAction === 'raise'
          ? `${handId}는 ${contextTitle}에서 오픈 후보입니다. 포지션과 뒤 플레이어 수를 함께 봅니다.`
          : `${handId}는 ${contextTitle}에서 낮은 빈도로만 섞는 주변부 핸드입니다.`,
      exploit:
        primaryAction === 'raise'
          ? '블라인드가 과폴드하면 오픈을 넓히고, 뒤 포지션 3-bet이 잦으면 주변부 핸드를 줄입니다.'
          : '뒤 플레이어가 수동적이고 블라인드가 타이트할 때만 낮은 빈도로 열고, 공격적인 테이블에서는 버립니다.',
    };
  }

  if (category === 'Defend') {
    return {
      note:
        primaryAction === 'call'
          ? `${handId}는 ${contextTitle}에서 가격과 포지션을 고려해 방어 후보가 됩니다.`
          : `${handId}는 ${contextTitle}에서 방어 빈도를 조심스럽게 잡는 핸드입니다.`,
      exploit:
        primaryAction === 'fold'
          ? '상대 오픈이 작고 너무 넓을 때만 일부 방어하고, 보통은 dominated hand를 피합니다.'
          : '상대가 넓게 오픈하면 콜/3-bet을 늘리고, 타이트한 오픈이면 콜 범위를 줄입니다.',
    };
  }

  return {
    note:
      primaryAction === 'fold'
        ? `${handId}는 ${context?.title ?? '3-bet 대응'}에서 무리하게 계속하지 않는 핸드입니다.`
        : `${handId}는 ${context?.title ?? '3-bet 대응'}에서 계속할 수 있는 방어 후보입니다.`,
    exploit:
      primaryAction === 'fold'
        ? '상대 3-bet이 밸류 위주면 더 빨리 버리고, 블러프가 확인될 때만 방어를 넓힙니다.'
        : '상대가 넓게 3-bet하면 콜/4-bet을 늘리고, 매우 타이트하면 방어 빈도를 낮춥니다.',
  };
};

const makeHand = (
  row: string,
  column: string,
  overrides: Partial<GtoHandStrategy> = {},
  adjust: MixAdjustment = (mix) => mix,
  context?: HandContext,
): GtoHandStrategy => {
  const id = getHandId(row, column);
  const baseline = adjust(getBaselineMix(id), id);
  const text = getDefaultHandText(id, baseline, context);

  return {
    id,
    ...baseline,
    ...text,
    ...overrides,
  };
};

const makeHands = (
  overrides: Record<string, Partial<GtoHandStrategy>>,
  adjust?: MixAdjustment,
  context?: HandContext,
): GtoHandStrategy[] =>
  handRanks.flatMap((row) =>
    handSuits.map((column) => {
      const id = getHandId(row, column);
      return makeHand(row, column, overrides[id], adjust, context);
    }),
  );

const makeSpot = (
  spot: Omit<GtoSpot, 'hands'>,
  overrides: Record<string, Partial<GtoHandStrategy>>,
  adjust?: MixAdjustment,
): GtoSpot => ({
  ...spot,
  hands: makeHands(overrides, adjust, spot),
});

const openOverrides = {
  AJs: {
    raise: 70,
    call: 20,
    fold: 10,
    note: 'AJs는 포지션이 좋아질수록 안정적인 오픈 후보입니다.',
    exploit:
      '뒤 플레이어가 타이트하면 더 자주 열고, 공격적인 3-bet이 많으면 일부 빈도를 낮춥니다.',
  },
  ATo: {
    raise: 62,
    call: 18,
    fold: 20,
    note: 'ATo는 버튼/컷오프에서는 오픈할 수 있지만 얼리 포지션에서는 지배당하기 쉽습니다.',
    exploit:
      '블라인드가 과폴드하면 넓게 열고, 뒤 포지션 압박이 강하면 타이트하게 조정합니다.',
  },
  K9o: {
    raise: 22,
    call: 10,
    fold: 68,
    exploit:
      '뒤 포지션과 블라인드가 수동적일 때만 일부 섞고, 공격적인 테이블에서는 줄입니다.',
  },
  '72o': {
    raise: 2,
    call: 0,
    fold: 98,
    exploit: '상대가 극단적으로 과폴드하지 않는 한 폴드가 기본입니다.',
  },
};

const tightOpenOverrides = {
  AJs: {
    raise: 62,
    call: 22,
    fold: 16,
    note: 'AJs는 얼리 포지션에서도 열 수 있지만 뒤 포지션 압박을 고려합니다.',
    exploit:
      '뒤 플레이어들이 너무 타이트하면 조금 넓히고, 3-bet이 많으면 낮춥니다.',
  },
  ATo: {
    raise: 20,
    call: 18,
    fold: 62,
    note: 'ATo는 버튼에서는 열 수 있지만 얼리 포지션에서는 지배당하기 쉬워 타이트하게 봅니다.',
    exploit:
      '뒤 플레이어가 매우 타이트할 때만 낮은 빈도로 열고, 3-bet이 많은 테이블에서는 폴드합니다.',
  },
  K9o: {
    raise: 4,
    call: 6,
    fold: 90,
    exploit:
      '얼리 포지션에서는 약한 오프수트 브로드웨이를 무리해서 열지 않습니다.',
  },
  '72o': {
    raise: 0,
    call: 0,
    fold: 100,
    exploit: '얼리 포지션에서는 거의 항상 폴드합니다.',
  },
};

const bbDefenseOverrides = {
  AJs: {
    raise: 28,
    call: 62,
    fold: 10,
    note: 'AJs는 콜과 일부 3-bet을 섞기 좋은 방어 핸드입니다.',
    exploit:
      '오픈이 너무 넓으면 3-bet을 늘리고, 강한 핸드만 열면 콜 비중을 낮춥니다.',
  },
  AA: {
    raise: 66,
    call: 30,
    fold: 4,
    note: 'AA는 오픈 상대로 강한 3-bet 후보입니다. 콜만으로 수동적으로 가지 않습니다.',
    exploit:
      '상대가 넓게 열수록 3-bet 가치가 커지고, 4-bet이 과하면 일부 트랩 콜도 섞습니다.',
  },
  K9o: {
    raise: 6,
    call: 38,
    fold: 56,
    exploit:
      '오픈이 넓고 사이즈가 작을 때만 일부 방어합니다. 기본은 콜 후보와 폴드 사이입니다.',
  },
  '72o': {
    raise: 0,
    call: 4,
    fold: 96,
    exploit: '가격이 좋아도 최하위 오프수트는 대부분 버립니다.',
  },
};

const threeBetOverrides = {
  AJs: {
    raise: 42,
    call: 38,
    fold: 20,
    note: 'AJs는 상대 오픈이 넓을수록 3-bet 후보가 됩니다.',
    exploit:
      '상대가 오픈 후 너무 많이 폴드하면 3-bet 빈도를 높이고, 4-bet이 강하면 콜/폴드를 늘립니다.',
  },
  AA: {
    raise: 86,
    call: 12,
    fold: 2,
    note: 'AA는 3-bet 밸류의 중심입니다.',
    exploit:
      '상대가 4-bet을 자주 하면 일부 콜을 섞고, 콜이 많으면 크게 3-bet합니다.',
  },
  K9o: {
    raise: 8,
    call: 8,
    fold: 84,
    exploit: '약한 오프수트 킹은 3-bet 블러프로 과하게 쓰지 않습니다.',
  },
};

const vsThreeBetOverrides = {
  AJs: {
    raise: 20,
    call: 56,
    fold: 24,
    note: 'AJs는 3-bet을 맞아도 계속할 수 있지만 상대 포지션과 성향에 크게 좌우됩니다.',
    exploit:
      '상대가 넓게 3-bet하면 콜/4-bet 후보가 되고, 타이트하면 폴드를 늘립니다.',
  },
  K9o: {
    raise: 2,
    call: 8,
    fold: 90,
    exploit: '약한 오프수트는 3-bet 팟에서 지배당하기 쉬워 대부분 버립니다.',
  },
};

export const gtoSpots: GtoSpot[] = [
  makeSpot(
    {
      id: 'utg-open-40bb',
      category: 'Open',
      title: 'UTG 오픈',
      format: '토너먼트',
      stackDepth: '40BB',
      position: 'UTG',
      description:
        '얼리 포지션에서 처음 여는 상황입니다. 뒤에 남은 플레이어가 많으므로 강한 핸드 중심으로 타이트하게 시작합니다.',
    },
    tightOpenOverrides,
    adjustMix(-16, -4),
  ),
  makeSpot(
    {
      id: 'lj-open-40bb',
      category: 'Open',
      title: 'LJ 오픈',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '로잭',
      description:
        '로잭에서 처음 여는 상황입니다. UTG보다 조금 넓지만 아직 뒤 포지션이 많아 브로드웨이와 중간 페어 중심으로 시작합니다.',
    },
    openOverrides,
    adjustMix(-11, -3),
  ),
  makeSpot(
    {
      id: 'hj-open-40bb',
      category: 'Open',
      title: 'HJ 오픈',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '하이잭',
      description:
        '하이잭까지 모두 폴드된 상황입니다. 중후반 포지션이라 로잭보다 넓게 열 수 있지만 버튼과 블라인드 압박은 남아 있습니다.',
    },
    openOverrides,
    adjustMix(-7, -2),
  ),
  makeSpot(
    {
      id: 'co-open-40bb',
      category: 'Open',
      title: 'CO 오픈',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '컷오프',
      description:
        '컷오프까지 모두 폴드된 상황입니다. 버튼보다 조금 타이트하지만 스틸 가치는 충분합니다.',
    },
    openOverrides,
    adjustMix(-3, 0),
  ),
  makeSpot(
    {
      id: 'btn-open-40bb',
      category: 'Open',
      title: 'BTN 오픈',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '버튼',
      description:
        '버튼까지 모두 폴드된 상황입니다. 포지션 이점이 있으니 넓게 열고, 블라인드 성향에 맞춰 조정합니다.',
    },
    {
      ...openOverrides,
      AJs: {
        raise: 70,
        call: 20,
        fold: 10,
        note: 'AJs는 버튼에서 강한 오픈 후보입니다. 콜보다 레이즈로 블라인드를 압박하는 것이 기본입니다.',
        exploit:
          '블라인드가 너무 타이트하면 오픈 빈도를 높이고, 3-bet이 잦으면 콜/폴드를 늘립니다.',
      },
    },
    adjustMix(8, -2),
  ),
  makeSpot(
    {
      id: 'sb-open-bb-40bb',
      category: 'Open',
      title: 'SB 오픈 vs BB',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '스몰블라인드',
      description:
        '스몰블라인드에서 빅블라인드만 남은 상황입니다. 포지션은 없지만 상대가 한 명이라 넓게 공격합니다.',
    },
    openOverrides,
    adjustMix(6, -2),
  ),
  makeSpot(
    {
      id: 'bb-defend-utg-40bb',
      category: 'Defend',
      title: 'BB 디펜스 vs UTG',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        'UTG 오픈을 빅블라인드에서 받는 상황입니다. 상대 범위가 강하므로 다른 방어 상황보다 타이트합니다.',
    },
    bbDefenseOverrides,
    adjustMix(-46, 28),
  ),
  makeSpot(
    {
      id: 'bb-defend-hj-40bb',
      category: 'Defend',
      title: 'BB 디펜스 vs HJ',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        '하이잭 오픈을 빅블라인드에서 받는 상황입니다. UTG보다 넓게 방어하지만 버튼 상대보다는 신중합니다.',
    },
    bbDefenseOverrides,
    adjustMix(-40, 34),
  ),
  makeSpot(
    {
      id: 'bb-defend-co-40bb',
      category: 'Defend',
      title: 'BB 디펜스 vs CO',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        '컷오프 오픈을 빅블라인드에서 받는 상황입니다. 버튼 오픈보다 상대 범위가 강하므로 방어 범위를 조금 줄입니다.',
    },
    bbDefenseOverrides,
    adjustMix(-38, 36),
  ),
  makeSpot(
    {
      id: 'bb-defend-btn-40bb',
      category: 'Defend',
      title: 'BB 디펜스 vs BTN',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        '빅블라인드에서 버튼 오픈을 받는 상황입니다. 가격은 좋지만 포지션이 없으므로 약한 오프수트는 줄입니다.',
    },
    bbDefenseOverrides,
    bbDefendButtonAdjust,
  ),
  makeSpot(
    {
      id: 'bb-defend-sb-40bb',
      category: 'Defend',
      title: 'BB 디펜스 vs SB',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        '스몰블라인드 오픈을 빅블라인드에서 받는 상황입니다. 포지션이 있고 상대 범위가 넓어 가장 넓게 방어합니다.',
    },
    bbDefenseOverrides,
    adjustMix(-28, 46),
  ),
  makeSpot(
    {
      id: 'btn-3bet-vs-co-40bb',
      category: '3-bet',
      title: 'BTN 3-bet vs CO',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '버튼',
      description:
        '컷오프 오픈을 버튼에서 받는 상황입니다. 포지션을 가진 3-bet으로 CO의 넓은 오픈을 압박합니다.',
    },
    threeBetOverrides,
    adjustMix(-10, 4),
  ),
  makeSpot(
    {
      id: 'sb-3bet-vs-btn-40bb',
      category: '3-bet',
      title: 'SB 3-bet vs BTN',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '스몰블라인드',
      description:
        '버튼 오픈을 스몰블라인드에서 받는 상황입니다. 포지션이 나쁘므로 콜보다 3-bet 또는 폴드 중심으로 단순화합니다.',
    },
    threeBetOverrides,
    adjustMix(-18, 6),
  ),
  makeSpot(
    {
      id: 'bb-3bet-vs-btn-40bb',
      category: '3-bet',
      title: 'BB 3-bet vs BTN',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        '버튼 오픈을 빅블라인드에서 받았을 때의 3-bet 후보입니다. 콜 방어와 다른 공격적 방어 축입니다.',
    },
    threeBetOverrides,
    adjustMix(-20, 10),
  ),
  makeSpot(
    {
      id: 'bb-3bet-vs-sb-40bb',
      category: '3-bet',
      title: 'BB 3-bet vs SB',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '빅블라인드',
      description:
        '스몰블라인드 오픈을 빅블라인드에서 받은 상황입니다. 포지션이 있어 넓은 3-bet 압박을 섞습니다.',
    },
    threeBetOverrides,
    adjustMix(-12, 8),
  ),
  makeSpot(
    {
      id: 'utg-vs-btn-sb-3bet-40bb',
      category: 'Vs 3-bet',
      title: 'UTG vs BTN/SB 3-bet',
      format: '토너먼트',
      stackDepth: '40BB',
      position: 'UTG',
      description:
        'UTG 오픈 후 뒤 포지션에게 3-bet을 받은 상황입니다. 내 오픈 범위도 강하지만 상대 3-bet도 강하므로 방어를 타이트하게 잡습니다.',
    },
    vsThreeBetOverrides,
    adjustMix(-50, 14),
  ),
  makeSpot(
    {
      id: 'co-vs-btn-3bet-40bb',
      category: 'Vs 3-bet',
      title: 'CO vs BTN 3-bet',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '컷오프',
      description:
        '컷오프 오픈 후 버튼에게 3-bet을 받은 상황입니다. 버튼은 포지션이 있어 압박하기 쉽기 때문에 방어 핸드를 선별합니다.',
    },
    vsThreeBetOverrides,
    adjustMix(-44, 20),
  ),
  makeSpot(
    {
      id: 'btn-vs-sb-bb-3bet-40bb',
      category: 'Vs 3-bet',
      title: 'BTN vs SB/BB 3-bet',
      format: '토너먼트',
      stackDepth: '40BB',
      position: '버튼',
      description:
        '버튼 오픈 후 블라인드에게 3-bet을 받은 상황입니다. 버튼 오픈 범위가 넓으므로 계속할 핸드를 선별합니다.',
    },
    vsThreeBetOverrides,
    adjustMix(-38, 26),
  ),
];
