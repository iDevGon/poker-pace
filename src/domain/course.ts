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
    prompt: '내 패 A♠ K♠, 커뮤니티 카드 A♦ 9♣ 4♥ 2♠ 2♣. 현재 내 주요 족보는?',
    context: '리버 쇼다운 직전',
    choices: [
      { id: 'top-pair', label: '탑페어' },
      { id: 'two-pair', label: '투페어' },
      { id: 'full-house', label: '풀하우스' },
    ],
    correctChoiceId: 'two-pair',
    explanation:
      'A 한 쌍과 커뮤니티 카드의 2 한 쌍을 함께 쓰므로 투페어입니다.',
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
    prompt: '커뮤니티 카드 J♠ T♠ 9♦는 어떤 보드에 가깝나요?',
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
      '내 패 A♠ 7♠, 커뮤니티 카드 K♠ 9♠ 2♦. 플러시를 완성할 남은 스페이드는 보통 몇 장으로 봅니까?',
    context: '플랍에서 넛 플러시 드로우',
    choices: [
      { id: '6', label: '6 아웃츠' },
      { id: '9', label: '9 아웃츠' },
      { id: '12', label: '12 아웃츠' },
    ],
    correctChoiceId: '9',
    explanation:
      '스페이드는 모두 13장입니다. 내 패 2장과 커뮤니티 카드 2장이 보였으니 남은 스페이드는 9장입니다.',
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
    prompt: '내 패 Q♥ J♥, 커뮤니티 카드 T♥ 9♥ 2♣. 내 핸드의 핵심 강점은?',
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
    prompt: '내 패 8♣ 8♦, 커뮤니티 카드 8♠ K♣ K♦ 3♥ 2♠. 현재 족보는?',
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
  {
    id: 'q-blinds-action-1',
    type: 'decision',
    prompt:
      'SB가 0.5BB, BB가 1BB를 낸 뒤 UTG가 3BB로 오픈했습니다. 내 자리는 HJ이고 A♦ T♣ 오프수트입니다. 기본 선택은?',
    context:
      '9명 테이블, 80BB, 초반 포지션 오픈 뒤 아직 뒤에 CO/BTN/SB/BB가 남음',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      'ATo는 겉보기엔 좋아도 UTG 오픈 상대로는 자주 지배당합니다. 뒤에 남은 플레이어도 많아 초보자는 폴드가 안전합니다.',
    tags: ['preflop', 'position'],
  },
  {
    id: 'q-limp-trap-1',
    type: 'decision',
    prompt:
      '앞에서 두 명이 림프했고 나는 CO에서 K♠ Q♠를 받았습니다. 블라인드는 패시브하고 3-bet이 거의 없습니다.',
    context: '60BB, 친구 토너먼트 초반, 림프가 많은 테이블',
    choices: basicChoices,
    correctChoiceId: 'raise',
    explanation:
      'KQs는 여러 림퍼를 상대로 가치가 있는 핸드입니다. 크게 무리하지 않는 사이즈로 레이즈해 주도권과 포지션을 활용합니다.',
    tags: ['preflop', 'limp', 'position'],
  },
  {
    id: 'q-call-vs-raise-1',
    type: 'decision',
    prompt:
      'BTN이 2.5BB로 오픈했고 나는 BB에서 A♣ 9♦를 받았습니다. BTN은 넓게 오픈하지만 플랍 이후 C-bet을 자주 합니다.',
    context: '40BB, 헤즈업으로 플랍을 볼 수 있는 빅블라인드 방어 상황',
    choices: basicChoices,
    correctChoiceId: 'call',
    explanation:
      'A9o는 BTN 오픈 상대로 즉시 버리기엔 아쉽지만 3-bet으로 키우기엔 애매합니다. 초보자는 콜 후 좋은 플랍에서만 계속합니다.',
    tags: ['preflop', 'defense', 'position'],
  },
  {
    id: 'q-small-pair-1',
    type: 'decision',
    prompt:
      'LJ가 2.5BB로 오픈했고 나는 BTN에서 5♣ 5♥를 받았습니다. 두 사람 모두 70BB 이상을 가지고 있습니다.',
    context: '깊은 스택, 포지션 있음, 뒤 블라인드는 타이트함',
    choices: basicChoices,
    correctChoiceId: 'call',
    explanation:
      '작은 포켓 페어는 셋을 맞추면 큰 팟을 이길 수 있습니다. 스택이 깊고 포지션이 있어 콜이 가능한 자리입니다.',
    tags: ['preflop', 'pocket-pair', 'position'],
  },
  {
    id: 'q-suited-connector-1',
    type: 'decision',
    prompt:
      'UTG가 오픈했고 MP가 콜했습니다. 나는 CO에서 8♥ 7♥를 받았습니다. 뒤에는 BTN과 블라인드가 남아 있습니다.',
    context: '45BB, 여러 명이 팟에 들어온 프리플랍',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '수딧 커넥터는 예쁘지만 초반 오픈과 콜 뒤에는 역으로 큰 팟을 잃기 쉽습니다. 스택도 아주 깊지 않아 폴드가 낫습니다.',
    tags: ['preflop', 'connector', 'position'],
  },
  {
    id: 'q-bb-defense-tight-1',
    type: 'decision',
    prompt:
      'CO가 2.2BB로 오픈했고 나는 BB에서 Q♠ J♦를 받았습니다. CO는 타이트하지만 스틸 시도는 가끔 합니다.',
    context: '35BB, 앤티 있음, 콜하면 포지션 없이 플랍 진행',
    choices: basicChoices,
    correctChoiceId: 'call',
    explanation:
      'QJo는 완벽하진 않지만 작은 오픈 사이즈와 앤티 때문에 BB에서 방어할 수 있습니다. 단, 탑페어를 맞춰도 과신하지 않습니다.',
    tags: ['preflop', 'defense', 'stack'],
  },
  {
    id: 'q-sb-complete-1',
    type: 'decision',
    prompt:
      '모두 폴드했고 나는 SB에서 9♣ 6♣를 받았습니다. BB는 체크를 많이 하고 레이즈가 거의 없습니다.',
    context: '50BB, SB vs BB, 팟에는 블라인드만 있음',
    choices: basicChoices,
    correctChoiceId: 'call',
    explanation:
      'SB는 포지션이 나쁘지만 BB가 패시브하면 작은 비용으로 플랍을 볼 수 있습니다. 큰 팟을 만들 생각은 하지 않습니다.',
    tags: ['preflop', 'blind', 'exploit'],
  },
  {
    id: 'q-flop-top-pair-1',
    type: 'decision',
    prompt:
      '내 패 A♣ Q♦, 커뮤니티 카드 Q♠ 8♥ 3♣. 프리플랍에서 내가 BTN 오픈했고 BB가 콜했습니다. BB가 체크했습니다.',
    context: '플랍, 탑페어 탑키커, 드라이 보드',
    choices: [
      { id: 'check', label: 'Check' },
      { id: 'small-bet', label: '작게 Bet' },
      { id: 'all-in', label: 'All-in' },
    ],
    correctChoiceId: 'small-bet',
    explanation:
      '좋은 탑페어지만 보드가 드라이해서 크게 몰아칠 필요는 없습니다. 작은 밸류벳으로 약한 Q, 8, 페어에게 콜을 받습니다.',
    tags: ['flop', 'value', 'board'],
  },
  {
    id: 'q-flop-cbet-dry-1',
    type: 'decision',
    prompt:
      '내 패 K♣ J♣, 커뮤니티 카드 A♦ 7♠ 2♥. 내가 CO에서 오픈했고 BB만 콜했습니다. BB가 체크했습니다.',
    context: '플랍, 에이스 하이 드라이 보드, 내게 메이드 핸드는 없음',
    choices: [
      { id: 'check', label: 'Check' },
      { id: 'small-bet', label: '작게 C-bet' },
      { id: 'large-bet', label: '크게 Bet' },
    ],
    correctChoiceId: 'small-bet',
    explanation:
      '오픈한 쪽에게 A가 많아 보이는 보드입니다. 작은 C-bet으로 폴드를 유도하되, 콜을 받으면 무리해서 계속하지 않습니다.',
    tags: ['flop', 'c-bet', 'board'],
  },
  {
    id: 'q-flop-multiway-1',
    type: 'decision',
    prompt:
      '내 패 A♥ J♥, 커뮤니티 카드 J♣ 9♣ 8♦. 세 명이 플랍을 봤고 앞 두 명이 체크했습니다.',
    context: '멀티웨이 팟, 탑페어지만 스트레이트/플러시 드로우가 많은 웻 보드',
    choices: [
      { id: 'check', label: 'Check' },
      { id: 'bet', label: 'Bet' },
      { id: 'all-in', label: 'All-in' },
    ],
    correctChoiceId: 'bet',
    explanation:
      '탑페어는 가치가 있지만 보드가 위험합니다. 체크로 공짜 카드를 주기보다 적당히 베팅해 드로우에게 비용을 내게 합니다.',
    tags: ['flop', 'multiway', 'board'],
  },
  {
    id: 'q-turn-scare-card-1',
    type: 'decision',
    prompt:
      '내 패 K♠ K♦, 보드 Q♣ 7♣ 2♥ A♣. 플랍에서 내가 베팅했고 상대가 콜했습니다. 턴에 A와 세 번째 클럽이 동시에 떴습니다.',
    context: '턴, 오버카드와 플러시 완성 가능성이 생긴 상황',
    choices: [
      { id: 'check', label: 'Check' },
      { id: 'small-bet', label: '작게 Bet' },
      { id: 'all-in', label: 'All-in' },
    ],
    correctChoiceId: 'check',
    explanation:
      'KK는 여전히 쇼다운 가치가 있지만 턴 카드가 매우 나쁩니다. 무리한 큰 베팅보다 체크로 팟을 조절합니다.',
    tags: ['turn', 'pot-control', 'board'],
  },
  {
    id: 'q-river-thin-value-1',
    type: 'decision',
    prompt:
      '내 패 A♦ T♦, 보드 T♣ 6♠ 3♥ 2♣ 2♦. 상대는 체크콜을 자주 하고 블러프 레이즈는 거의 없습니다.',
    context: '리버, 탑페어 좋은 키커, 팟은 중간 크기',
    choices: [
      { id: 'check', label: 'Check back' },
      { id: 'small-bet', label: '작게 Bet' },
      { id: 'all-in', label: 'All-in' },
    ],
    correctChoiceId: 'small-bet',
    explanation:
      '콜을 많이 하는 상대에게는 작은 밸류벳이 좋습니다. 다만 큰 올인은 더 약한 핸드를 쫓아내기 쉽습니다.',
    tags: ['river', 'value', 'exploit'],
  },
  {
    id: 'q-river-bluff-catch-1',
    type: 'decision',
    prompt:
      '내 패 Q♠ Q♥, 보드 K♦ 9♣ 6♠ 4♥ 2♣. 상대가 플랍과 턴을 체크했고 리버에서 갑자기 팟 크기로 베팅했습니다.',
    context: '리버, 원페어 쇼다운 가치 있음, 상대는 평소 패시브함',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '패시브한 상대의 큰 리버 베팅은 대체로 강한 핸드입니다. QQ는 쇼다운 가치는 있지만 큰 베팅을 받기엔 부족합니다.',
    tags: ['river', 'bluff-catch', 'exploit'],
  },
  {
    id: 'q-outs-straight-1',
    type: 'reading',
    prompt:
      '내 패 9♠ 8♠, 커뮤니티 카드 7♦ 6♣ 2♥. 턴에서 스트레이트를 완성할 직접 아웃츠는 보통 몇 장인가요?',
    context: '플랍, OESD가 있는 상황',
    choices: [
      { id: '4', label: '4장' },
      { id: '8', label: '8장' },
      { id: '12', label: '12장' },
    ],
    correctChoiceId: '8',
    explanation:
      '5가 오면 5-6-7-8-9, T가 오면 6-7-8-9-T가 됩니다. 네 장씩 두 종류라 총 8아웃츠입니다.',
    tags: ['outs', 'straight', 'reading'],
  },
  {
    id: 'q-pot-odds-call-1',
    type: 'decision',
    prompt:
      '팟이 1,000이고 상대가 500을 베팅했습니다. 나는 플러시 드로우가 있고 다음 카드 한 장을 보려 합니다.',
    context: '턴으로 가기 전, 콜하면 총 팟은 2,000, 콜 비용은 500',
    choices: [
      { id: 'fold', label: '무조건 Fold' },
      { id: 'call', label: '콜 고려' },
      { id: 'all-in', label: '무조건 All-in' },
    ],
    correctChoiceId: 'call',
    explanation:
      '500을 내고 2,000을 노리는 구조라 필요한 승률은 약 25%입니다. 플러시 드로우는 대략 그 근처라 콜을 고려할 수 있습니다.',
    tags: ['pot-odds', 'draw', 'turn'],
  },
  {
    id: 'q-tournament-ante-steal-1',
    type: 'decision',
    prompt:
      '앤티가 생긴 뒤 모두 폴드했고 나는 BTN에서 K♣ 8♣를 받았습니다. SB와 BB는 너무 자주 폴드합니다.',
    context: '25BB, 토너먼트 중반, 블라인드와 앤티가 팟에 있음',
    choices: basicChoices,
    correctChoiceId: 'raise',
    explanation:
      '앤티가 있으면 훔칠 수 있는 팟이 커집니다. 뒤 블라인드가 타이트하면 버튼에서 넓게 스틸할 수 있습니다.',
    tags: ['tournament', 'steal', 'exploit'],
  },
  {
    id: 'q-short-stack-fold-equity-1',
    type: 'decision',
    prompt:
      '내 스택은 9BB이고 CO에서 A♠ 5♠를 받았습니다. 앞은 모두 폴드했고 뒤에는 BTN/SB/BB가 남았습니다.',
    context: '토너먼트 후반, 앤티 있음, 콜하면 스택이 어중간해짐',
    choices: [
      { id: 'fold', label: 'Fold' },
      { id: 'call', label: 'Limp' },
      { id: 'shove', label: 'All-in' },
    ],
    correctChoiceId: 'shove',
    explanation:
      '9BB에서는 작은 레이즈 후 폴드하기 어렵습니다. A5s는 폴드 에쿼티와 에이스 블로커가 있어 올인 후보입니다.',
    tags: ['tournament', 'short-stack', 'preflop'],
  },
  {
    id: 'q-big-stack-pressure-1',
    type: 'decision',
    prompt:
      '나는 테이블 빅스택이고 BTN입니다. SB와 BB는 중간 스택이며 입상을 의식해 큰 충돌을 피합니다. 내 패는 Q♦ T♦입니다.',
    context: '버블 근처, 모두 폴드 후 버튼 액션',
    choices: basicChoices,
    correctChoiceId: 'raise',
    explanation:
      '빅스택은 버블 근처에서 중간 스택을 압박할 수 있습니다. QTs는 버튼 오픈으로 충분히 좋은 핸드입니다.',
    tags: ['tournament', 'bubble', 'position'],
  },
  {
    id: 'q-tilt-control-1',
    type: 'decision',
    prompt:
      '방금 배드빗을 맞고 큰 팟을 잃었습니다. 다음 핸드에 A♣ 4♦가 왔고 UTG가 오픈했습니다. “되찾아야 한다”는 생각이 듭니다.',
    context: '50BB, 감정이 흔들린 직후, 초반 포지션 오픈 상대',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '틸트 상태에서는 평소보다 콜을 넓히기 쉽습니다. A4o는 UTG 오픈 상대로 약하므로 감정과 무관하게 폴드합니다.',
    tags: ['mindset', 'tilt', 'preflop'],
  },
  {
    id: 'q-table-image-1',
    type: 'decision',
    prompt:
      '최근 20분 동안 내가 거의 모든 팟에 참가했습니다. 이번에 HJ에서 A♠ J♣를 받고 오픈하자 BTN이 바로 3-bet했습니다.',
    context: '45BB, 상대는 내가 루즈하다고 느낄 가능성이 큼',
    choices: basicChoices,
    correctChoiceId: 'call',
    explanation:
      '내 이미지 때문에 상대가 넓게 3-bet할 수 있습니다. AJo는 애매하지만 포지션이 나쁘지 않아 콜로 플랍을 볼 수 있습니다.',
    tags: ['image', 'preflop', 'exploit'],
  },
  {
    id: 'q-bankroll-buyin-1',
    type: 'decision',
    prompt:
      '친구 토너먼트에서 리바이가 가능하고, 초반에 30BB가 남았습니다. A♦ 7♣로 큰 올인을 콜하면 지면 바로 리바이해야 합니다.',
    context: '초반, 상대는 평소 큰 올인에 강한 핸드가 많은 편',
    choices: basicChoices,
    correctChoiceId: 'fold',
    explanation:
      '리바이가 가능해도 약한 에이스로 큰 올인을 받는 습관은 좋지 않습니다. 초보자는 좋은 자리와 강한 핸드를 기다립니다.',
    tags: ['tournament', 'risk', 'preflop'],
  },
];

const quizRotation = quizzes.map((quiz) => quiz.id);

export const pickRandomQuizIds = (
  quizIds: string[],
  count: number,
  random = Math.random,
) => {
  const shuffled = [...new Set(quizIds)];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
};

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
        quizRotation[(index * 2) % quizRotation.length],
        quizRotation[(index * 2 + 1) % quizRotation.length],
      ],
    };
  },
);
