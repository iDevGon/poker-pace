import type { CourseUnit, Quiz } from './types';

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
      '프리플랍에서 내 앞에 레이즈와 리레이즈가 나왔습니다. 내 패는 7♣ 2♦입니다. 기본 선택은?',
    context: '초반 블라인드, 100BB, 언더더건 오픈 후 컷오프 3-bet',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '7-2 offsuit는 최약체 핸드입니다. 앞에서 강한 액션이 나왔으니 미련 없이 폴드합니다.',
    tags: ['rules', 'preflop'],
  },
  {
    id: 'q-hand-rank-1',
    type: 'reading',
    prompt: '내 패 A♠ K♠, 보드 A♦ 9♣ 4♥ 2♠ 2♣. 현재 내 주요 족보는?',
    context: '리버 쇼다운 직전',
    choices: [
      { id: 'top-pair', label: '탑페어' },
      { id: 'two-pair', label: '투페어' },
      { id: 'full-house', label: '풀하우스' },
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
      '초반 포지션에서는 뒤에 남은 플레이어가 많습니다. 애매한 오프수트 브로드웨이는 줄이는 편이 좋습니다.',
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
      { id: 'dry', label: '드라이 보드' },
      { id: 'wet', label: '웻 보드' },
      { id: 'paired', label: '페어 보드' },
    ],
    correctChoiceId: 'wet',
    explanation:
      '스트레이트와 플러시 드로우가 많아 연결성이 높은 웻 보드입니다.',
    tags: ['flop', 'reading'],
  },
  {
    id: 'q-outs-flush-1',
    type: 'reading',
    prompt:
      '내 패 A♠ 7♠, 보드 K♠ 9♠ 2♦. 플러시를 완성할 남은 스페이드는 보통 몇 장으로 봅니까?',
    context: '플랍에서 넛 플러시 드로우',
    choices: [
      { id: '6', label: '6 아웃츠' },
      { id: '9', label: '9 아웃츠' },
      { id: '12', label: '12 아웃츠' },
    ],
    correctChoiceId: '9',
    explanation:
      '스페이드는 모두 13장입니다. 내 패 2장과 보드 2장이 보였으니 남은 스페이드는 9장입니다.',
    tags: ['outs', 'flush'],
  },
  {
    id: 'q-pot-odds-1',
    type: 'decision',
    prompt:
      '리버에서 상대가 크게 올인했습니다. 내 손에는 미스한 드로우뿐이고 쇼다운 가치가 없습니다.',
    context: '블러프 캐치 근거도 부족한 상황',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '이길 수 있는 메이드 핸드가 없고 상대를 폴드시킬 액션도 아닙니다. 콜은 칩 낭비입니다.',
    tags: ['river', 'decision'],
  },
  {
    id: 'q-stack-1',
    type: 'decision',
    prompt:
      '12BB로 버튼에서 A♣ 8♣를 받았습니다. 모두 폴드했다면 토너먼트 기본 선택은?',
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
      '입상 직전입니다. 내 스택은 평균보다 작고 빅스택이 계속 압박합니다. 애매한 핸드로 큰 팟을 만들까요?',
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
    explanation: 'K나 8이 오면 스트레이트가 되고, 하트가 오면 플러시도 됩니다.',
    tags: ['review', 'draw'],
  },
  {
    id: 'q-showdown-1',
    type: 'reading',
    prompt: '내 패 8♣ 8♦, 보드 8♠ K♣ K♦ 3♥ 2♠. 현재 족보는?',
    context: '리버 쇼다운',
    choices: [
      { id: 'trips', label: '트립스' },
      { id: 'full-house', label: '풀하우스' },
      { id: 'four-kind', label: '포카드' },
    ],
    correctChoiceId: 'full-house',
    explanation: '8 세 장과 K 두 장으로 풀하우스입니다.',
    tags: ['rank', 'showdown'],
  },
  {
    id: 'q-gto-baseline-1',
    type: 'decision',
    prompt:
      '버튼에서 A♥ J♥를 들고 있고 모두 폴드했습니다. GTO 기준선을 먼저 본다면 출발점은?',
    context: '40BB, 버튼 오픈 상황',
    choices: [
      { id: 'fold', label: '대부분 Fold' },
      { id: 'mix', label: '레이즈 중심으로 일부 섞기' },
      { id: 'limp', label: '항상 Limp' },
    ],
    correctChoiceId: 'mix',
    explanation:
      'GTO는 한 가지 고정 답보다 상황별 빈도를 봅니다. 버튼 AJs는 레이즈 중심의 강한 후보입니다.',
    tags: ['gto', 'preflop'],
  },
  {
    id: 'q-exploit-tight-blinds-1',
    type: 'decision',
    prompt:
      '블라인드 두 명이 너무 자주 폴드합니다. 버튼 오픈 전략은 어떻게 조정할까요?',
    context: '블라인드가 3-bet을 거의 하지 않는 테이블',
    choices: [
      { id: 'tighten', label: '오픈 범위를 줄인다' },
      { id: 'widen', label: '오픈 범위를 넓힌다' },
      { id: 'limp', label: '모든 핸드를 림프한다' },
    ],
    correctChoiceId: 'widen',
    explanation:
      '익스플로잇은 상대의 반복 실수를 이용하는 조정입니다. 과폴드하는 블라인드에게는 더 넓게 오픈합니다.',
    tags: ['exploit', 'preflop'],
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
        '1주차 복습',
      ],
      [
        '포지션 감각',
        '오픈 레이즈',
        '콜과 3-bet',
        '버튼 플레이',
        '블라인드 방어',
        '레이즈 크기',
        '2주차 복습',
      ],
      [
        '보드 텍스처',
        '탑페어 판단',
        '드로우와 아웃츠',
        '팟오즈 기초',
        '턴에서 재평가',
        '리버 결정',
        '3주차 복습',
      ],
      [
        '스택 크기',
        '숏스택 푸시',
        '블라인드 압박',
        '버블 감각',
        '파이널 테이블',
        '상대 성향 조정',
        '최종 리허설',
      ],
    ];
    const extraLessonBlocks =
      week === 2 && weekDay === 6
        ? [
            {
              heading: 'GTO 기준선',
              body: 'GTO는 상대가 완벽히 대응해도 크게 무너지지 않는 기준선입니다. 초보 단계에서는 정확한 솔버 암기보다 “이 상황에서 어떤 액션을 얼마나 섞는가”를 보는 정도면 충분합니다.',
            },
          ]
        : week === 3 && weekDay === 6
          ? [
              {
                heading: '익스플로잇 조정',
                body: '익스플로잇은 상대의 반복 실수에 맞춰 기준선을 일부러 벗어나는 선택입니다. 너무 자주 폴드하는 상대에게는 블러프와 오픈을 늘리고, 너무 자주 콜하는 상대는 밸류 중심으로 압박합니다.',
              },
            ]
          : week === 4 && weekDay === 6
            ? [
                {
                  heading: '기준선과 조정의 순서',
                  body: '먼저 GTO 기준선으로 기본 범위를 잡고, 상대의 반복 성향을 본 뒤 작은 조정을 합니다. 근거 없이 매번 바꾸는 것은 익스플로잇이 아니라 흔들림입니다.',
                },
              ]
            : [];

    return {
      id: `w${week}d${weekDay}`,
      week,
      day: weekDay,
      title: titleSeeds[week - 1][weekDay - 1],
      goal: `${weeklyTopics[week - 1]}을 실제 핸드 결정으로 연결합니다.`,
      estimatedMinutes: weekDay === 7 ? 12 : 8,
      lessonBlocks: [
        {
          heading: weeklyTopics[week - 1],
          body: '오늘은 한 가지 개념만 잡고 바로 퀴즈로 확인합니다. 완벽한 암기보다 좋은 결정을 반복하는 감각이 우선입니다.',
        },
        {
          heading: '실전 기준',
          body: '노리밋 홀덤에서는 애매한 큰 팟을 줄이고, 포지션이 좋을 때 좋은 패로 압박하는 습관이 중요합니다.',
        },
        ...extraLessonBlocks,
      ],
      quizIds: [
        quizRotation[index % quizRotation.length],
        quizRotation[(index + 4) % quizRotation.length],
      ],
    };
  },
);
