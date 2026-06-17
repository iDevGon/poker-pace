import type { CourseUnit, Quiz, TournamentChecklistItem } from './types';

const basicChoices = [
  { id: 'fold', label: 'Fold' },
  { id: 'call', label: 'Call' },
  { id: 'raise', label: 'Raise' },
];

export const quizzes: Quiz[] = [
  {
    id: 'q-rules-flow-1',
    type: 'decision',
    prompt:
      '프리플랍에서 내 앞에 레이즈와 리레이즈가 나왔고, 나는 7♣ 2♦를 들고 있습니다. 기본 선택은?',
    context: '초반 블라인드, 100BB, 언더더건 오픈 후 컷오프 3-bet',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '7-2 offsuit는 최약체 핸드입니다. 강한 액션이 앞에서 나온 상황에서는 미련 없이 폴드합니다.',
    tags: ['rules', 'preflop'],
  },
  {
    id: 'q-hand-rank-1',
    type: 'reading',
    prompt: '내 패 A♠ K♠, 보드 A♦ 9♣ 4♥ 2♠ 2♣. 현재 내 주요 족보는?',
    context: '리버 쇼다운 직전',
    choices: [
      { id: 'top-pair', label: 'Top pair' },
      { id: 'two-pair', label: 'Two pair' },
      { id: 'full-house', label: 'Full house' },
    ],
    correctChoiceId: 'two-pair',
    explanation: 'A 한 쌍과 보드의 2 한 쌍을 함께 쓰므로 투페어입니다.',
    tags: ['rank', 'reading'],
  },
  {
    id: 'q-position-1',
    type: 'decision',
    prompt: '버튼에서 A♥ J♥를 들고 모두 폴드했습니다. 기본 선택은?',
    context: '40BB, 블라인드만 남은 프리플랍',
    choices: basicChoices,
    correctChoiceId: 'raise',
    explanation:
      '버튼은 포지션 이점이 크고 AJs는 강한 오픈 핸드입니다. 레이즈로 블라인드를 압박합니다.',
    tags: ['position', 'preflop'],
  },
  {
    id: 'q-preflop-position-1',
    type: 'decision',
    prompt:
      '초반 포지션에서 K♦ 9♣를 받았습니다. 앞 액션은 없습니다. 기본 선택은?',
    context: '9명 테이블, 50BB, UTG+1',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '초반 포지션에서는 뒤에 남은 플레이어가 많아 애매한 오프수트 브로드웨이를 줄이는 것이 좋습니다.',
    tags: ['position', 'preflop'],
  },
  {
    id: 'q-open-size-1',
    type: 'decision',
    prompt:
      '중반 블라인드, 35BB로 컷오프에서 Q♠ Q♦를 받았습니다. 모두 폴드했습니다.',
    context: '프리플랍 오픈 상황',
    choices: basicChoices,
    correctChoiceId: 'raise',
    explanation:
      'QQ는 프리미엄 핸드입니다. 콜로 숨기기보다 레이즈로 팟을 키우고 약한 핸드를 정리합니다.',
    tags: ['preflop', 'sizing'],
  },
  {
    id: 'q-board-texture-1',
    type: 'reading',
    prompt: '보드 J♠ T♠ 9♦는 어떤 보드에 가깝나요?',
    context: '플랍 텍스처 판단',
    choices: [
      { id: 'dry', label: 'Dry board' },
      { id: 'wet', label: 'Wet board' },
      { id: 'paired', label: 'Paired board' },
    ],
    correctChoiceId: 'wet',
    explanation:
      '스트레이트와 플러시 드로우가 많아 연결성이 높은 wet board입니다.',
    tags: ['flop', 'reading'],
  },
  {
    id: 'q-outs-flush-1',
    type: 'reading',
    prompt:
      '내 패 A♠ 7♠, 보드 K♠ 9♠ 2♦. 플러시를 완성할 남은 스페이드는 보통 몇 장으로 봅니까?',
    context: '플랍에서 넛 플러시 드로우',
    choices: [
      { id: '6', label: '6 outs' },
      { id: '9', label: '9 outs' },
      { id: '12', label: '12 outs' },
    ],
    correctChoiceId: '9',
    explanation:
      '스페이드는 총 13장이고 내 패 2장, 보드 2장이 보였으므로 남은 스페이드는 9장입니다.',
    tags: ['outs', 'flush'],
  },
  {
    id: 'q-pot-odds-1',
    type: 'decision',
    prompt:
      '리버에서 상대가 큰 올인을 했고, 나는 미스한 드로우뿐입니다. 쇼다운 가치가 없습니다.',
    context: '블러프 캐치 근거도 부족한 상황',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '이길 수 있는 made hand가 없고 상대를 폴드시킬 액션도 아닙니다. 콜은 칩 낭비입니다.',
    tags: ['river', 'decision'],
  },
  {
    id: 'q-stack-1',
    type: 'decision',
    prompt:
      '12BB로 버튼에서 A♣ 8♣를 받았고 모두 폴드했습니다. 토너먼트 기본 선택은?',
    context: '숏스택, 앤티 있음',
    choices: [
      { id: 'fold', label: 'Fold' },
      { id: 'call', label: 'Limp/Call' },
      { id: 'shove', label: 'All-in' },
    ],
    correctChoiceId: 'shove',
    explanation:
      '숏스택 버튼에서 A8s는 강한 푸시 후보입니다. 작은 레이즈보다 올인으로 폴드 에쿼티를 확보합니다.',
    tags: ['tournament', 'stack'],
  },
  {
    id: 'q-bubble-1',
    type: 'decision',
    prompt:
      '입상 직전, 내 스택은 평균보다 작고 빅스택이 계속 압박합니다. 애매한 핸드로 큰 팟을 만들까요?',
    context: '버블 근처, 중간 스택 다수',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '버블에서는 칩 가치와 탈락 위험이 커집니다. 근거 없는 큰 팟은 피하고 좋은 자리에서 승부합니다.',
    tags: ['tournament', 'bubble'],
  },
  {
    id: 'q-final-review-1',
    type: 'reading',
    prompt: '내 패 Q♥ J♥, 보드 T♥ 9♥ 2♣. 내 핸드의 핵심 강점은?',
    context: '플랍에서 강한 콤보 드로우',
    choices: [
      { id: 'nothing', label: '아무것도 없음' },
      { id: 'combo-draw', label: '스트레이트+플러시 드로우' },
      { id: 'made-flush', label: '완성 플러시' },
    ],
    correctChoiceId: 'combo-draw',
    explanation:
      'K 또는 8로 스트레이트 가능성이 있고, 하트가 오면 플러시도 됩니다.',
    tags: ['review', 'draw'],
  },
  {
    id: 'q-showdown-1',
    type: 'reading',
    prompt: '내 패 8♣ 8♦, 보드 8♠ K♣ K♦ 3♥ 2♠. 현재 족보는?',
    context: '리버 쇼다운',
    choices: [
      { id: 'trips', label: 'Trips' },
      { id: 'full-house', label: 'Full house' },
      { id: 'four-kind', label: 'Four of a kind' },
    ],
    correctChoiceId: 'full-house',
    explanation: '8 세 장과 K 두 장으로 풀하우스입니다.',
    tags: ['rank', 'showdown'],
  },
];

const quizRotation = quizzes.map((quiz) => quiz.id);

export const courseUnits: CourseUnit[] = Array.from(
  { length: 28 },
  (_, index) => {
    const week = Math.floor(index / 7) + 1;
    const weekDay = (index % 7) + 1;
    const weeklyTopics = [
      '룰과 게임 흐름',
      '포지션과 프리플랍',
      '플랍 이후 판단',
      '토너먼트 실전 준비',
    ];
    const titleSeeds = [
      [
        '게임 흐름 익히기',
        '족보 빠르게 읽기',
        '블라인드와 액션',
        '쇼다운 이해',
        '좋은 시작패',
        '나쁜 시작패',
        'Week 1 복습',
      ],
      [
        '포지션 감각',
        '오픈 레이즈',
        '콜과 3-bet',
        '버튼 플레이',
        '블라인드 방어',
        '레이즈 크기',
        'Week 2 복습',
      ],
      [
        '보드 텍스처',
        '탑페어 판단',
        '드로우와 아웃츠',
        '팟오즈 기초',
        '턴에서 재평가',
        '리버 결정',
        'Week 3 복습',
      ],
      [
        '스택 크기',
        '숏스택 푸시',
        '블라인드 압박',
        '버블 감각',
        '파이널 테이블',
        '친구 대회 전략',
        '최종 리허설',
      ],
    ];

    return {
      id: `w${week}d${weekDay}`,
      week,
      day: weekDay,
      title: titleSeeds[week - 1][weekDay - 1],
      goal: `${weeklyTopics[week - 1]}을 실제 한 손 결정으로 연결합니다.`,
      estimatedMinutes: weekDay === 7 ? 12 : 8,
      lessonBlocks: [
        {
          heading: weeklyTopics[week - 1],
          body: '오늘은 한 가지 개념만 잡고 바로 퀴즈로 확인합니다. 완벽한 암기보다 반복해서 좋은 결정을 내리는 감각이 우선입니다.',
        },
        {
          heading: '실전 기준',
          body: '친구들과 하는 노리밋 홀덤 토너먼트에서는 애매한 큰 팟을 줄이고, 포지션이 좋을 때 좋은 패로 압박하는 습관이 중요합니다.',
        },
      ],
      quizIds: [
        quizRotation[index % quizRotation.length],
        quizRotation[(index + 4) % quizRotation.length],
      ],
    };
  },
);

export const tournamentChecklistItems: TournamentChecklistItem[] = [
  {
    id: 'participants',
    label: '참가 인원',
    description: '몇 명이 시작하고 중간 참가를 허용할지 정합니다.',
  },
  {
    id: 'starting-chips',
    label: 'Starting chips',
    description: '모든 참가자가 같은 시작 칩을 받도록 정합니다.',
  },
  {
    id: 'blind-interval',
    label: 'Blind increase interval',
    description: '블라인드가 몇 분마다 오를지 정합니다.',
  },
  {
    id: 'blind-structure',
    label: 'Blind structure',
    description: '첫 블라인드와 상승 단계를 미리 적습니다.',
  },
  {
    id: 'rebuy',
    label: 'Rebuy rule',
    description: '탈락 후 재참가 가능 여부와 횟수를 정합니다.',
  },
  {
    id: 'chip-colors',
    label: 'Chip colors',
    description: '칩 색상별 가치를 헷갈리지 않게 정합니다.',
  },
  {
    id: 'prize',
    label: 'Prize split',
    description: '상금이나 상품 배분 방식을 미리 합의합니다.',
  },
];
