import { ArrowLeft, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '../components/Card';

export type GuideEntry = {
  term: string;
  english?: string;
  category: string;
  description: string;
  example?: string;
  cards?: string[];
  aliases: string[];
};

type GuideTab = 'hands' | 'terms';

export const guideEntries: GuideEntry[] = [
  {
    term: '로열 플러시',
    english: 'Royal Flush',
    category: '족보',
    description:
      '같은 무늬의 A, K, Q, J, T입니다. 홀덤에서 가장 강한 족보입니다.',
    cards: ['A♠', 'K♠', 'Q♠', 'J♠', 'T♠'],
    aliases: ['royal flush', '로티플', '최고 족보'],
  },
  {
    term: '스트레이트 플러시',
    english: 'Straight Flush',
    category: '족보',
    description: '같은 무늬로 숫자가 5장 이어진 족보입니다.',
    cards: ['9♥', '8♥', '7♥', '6♥', '5♥'],
    aliases: ['straight flush', '스티플'],
  },
  {
    term: '포카드',
    english: 'Four of a Kind',
    category: '족보',
    description: '같은 숫자 4장입니다. 풀하우스보다 강합니다.',
    cards: ['Q♠', 'Q♥', 'Q♦', 'Q♣', '7♠'],
    aliases: ['four of a kind', '쿼즈', 'quads'],
  },
  {
    term: '풀하우스',
    english: 'Full House',
    category: '족보',
    description: '같은 숫자 3장과 같은 숫자 2장이 함께 있는 족보입니다.',
    cards: ['K♠', 'K♥', 'K♦', '7♣', '7♠'],
    aliases: ['full house', '보트', '페어', '트리플'],
  },
  {
    term: '플러시',
    english: 'Flush',
    category: '족보',
    description: '무늬가 같은 카드 5장입니다. 숫자가 이어질 필요는 없습니다.',
    cards: ['A♦', 'J♦', '8♦', '4♦', '2♦'],
    aliases: ['flush', '무늬'],
  },
  {
    term: '스트레이트',
    english: 'Straight',
    category: '족보',
    description:
      '무늬와 상관없이 숫자가 5장 이어진 족보입니다. A는 A-2-3-4-5의 낮은 끝이나 T-J-Q-K-A의 높은 끝으로만 쓰며, Q-K-A-2-3처럼 가운데를 잇지는 못합니다.',
    cards: ['T♣', '9♥', '8♦', '7♠', '6♣'],
    aliases: ['straight', '줄', 'A2345', 'TJQKA', '휠'],
  },
  {
    term: '트리플',
    english: 'Three of a Kind',
    category: '족보',
    description:
      '같은 숫자 3장입니다. 투페어보다 강하고 스트레이트보다 약합니다.',
    cards: ['8♠', '8♥', '8♣', 'K♦', '3♠'],
    aliases: ['three of a kind', '셋', 'set', 'trips'],
  },
  {
    term: '투페어',
    english: 'Two Pair',
    category: '족보',
    description: '서로 다른 페어가 2개 있는 족보입니다.',
    cards: ['A♣', 'A♥', '9♠', '9♦', '4♣'],
    aliases: ['two pair'],
  },
  {
    term: '원페어',
    english: 'One Pair',
    category: '족보',
    description: '같은 숫자 2장입니다.',
    cards: ['J♠', 'J♦', 'A♣', '8♥', '2♠'],
    aliases: ['one pair', '페어'],
  },
  {
    term: '하이카드',
    english: 'High Card',
    category: '족보',
    description: '아무 족보도 없을 때 가장 높은 카드로 승부합니다.',
    cards: ['A♠', 'J♦', '9♣', '6♥', '3♠'],
    aliases: ['high card', '노페어'],
  },
  {
    term: '포켓 페어',
    english: 'Pocket Pair',
    category: '핸드 표기',
    description: '처음 받은 두 장의 숫자가 같은 핸드입니다.',
    example: 'AA, KK, 77',
    aliases: ['pocket pair', '포켓', '페어', 'AA', 'KK', '77'],
  },
  {
    term: '에어라인',
    english: 'Aces',
    category: '패 별칭',
    description:
      'AA를 부르는 별칭입니다. 프리플랍에서 가장 강한 시작 핸드입니다.',
    example: 'AA',
    aliases: ['aces', 'pocket aces', 'AA', '아메리칸 에어라인'],
  },
  {
    term: '킹스',
    english: 'Kings',
    category: '패 별칭',
    description: 'KK를 부르는 별칭입니다. AA 다음으로 강한 포켓 페어입니다.',
    example: 'KK',
    aliases: ['kings', 'KK', '카우보이'],
  },
  {
    term: '수딧',
    english: 'Suited',
    category: '핸드 표기',
    description: '두 카드의 무늬가 같은 핸드입니다. 표기 끝에 s를 붙입니다.',
    example: 'AJs',
    aliases: ['suited', 's', '같은 무늬', 'AJs', '98s'],
  },
  {
    term: '오프수트',
    english: 'Offsuit',
    category: '핸드 표기',
    description: '두 카드의 무늬가 다른 핸드입니다. 표기 끝에 o를 붙입니다.',
    example: 'KQo',
    aliases: ['offsuit', 'off suit', 'o', '다른 무늬', 'KQo'],
  },
  {
    term: '브로드웨이',
    english: 'Broadway',
    category: '핸드 표기',
    description: 'A, K, Q, J, T처럼 높은 카드들을 부르는 말입니다.',
    example: 'AK, KQ, QJ',
    aliases: ['broadway', 'AK', 'KQ', 'QJ', 'T'],
  },
  {
    term: '커넥터',
    english: 'Connector',
    category: '핸드 표기',
    description: '숫자가 이어진 두 장입니다. 스트레이트 가능성이 있습니다.',
    example: '98s, 76o',
    aliases: ['connector', '수딧 커넥터', '98s', '76o'],
  },
  {
    term: 'UTG',
    english: 'Under the Gun',
    category: '포지션',
    description: '프리플랍에서 빅블라인드 왼쪽의 가장 이른 포지션입니다.',
    aliases: ['언더더건', 'under the gun'],
  },
  {
    term: 'UTG+1',
    english: 'Under the Gun Plus One',
    category: '포지션',
    description:
      'UTG 바로 왼쪽 자리입니다. 아직 뒤에 남은 플레이어가 많아 타이트하게 시작하는 편입니다.',
    aliases: ['언더더건 플러스 원', 'early position', 'EP'],
  },
  {
    term: 'LJ',
    english: 'Lojack',
    category: '포지션',
    description: '9명 테이블 기준 중간 포지션으로, 하이잭보다 이른 자리입니다.',
    aliases: ['로잭', 'lojack', 'middle position', 'MP'],
  },
  {
    term: 'HJ',
    english: 'Hijack',
    category: '포지션',
    description:
      '컷오프 바로 오른쪽 자리입니다. 중후반 포지션이라 오픈 레인지가 조금 넓어집니다.',
    aliases: ['하이잭', 'hijack'],
  },
  {
    term: 'CO',
    english: 'Cutoff',
    category: '포지션',
    description:
      '버튼 바로 오른쪽 자리입니다. 버튼 다음으로 포지션 이점이 큰 자리입니다.',
    aliases: ['컷오프', 'cutoff'],
  },
  {
    term: 'BB',
    english: 'Big Blind',
    category: '포지션',
    description:
      '카드를 받기 전에 의무로 큰 블라인드를 내는 자리입니다. 동시에 스택이나 팟 크기를 세는 단위로도 씁니다.',
    example: '100BB',
    aliases: ['big blind', '빅블라인드', '블라인드', '100BB', '200BB'],
  },
  {
    term: 'SB',
    english: 'Small Blind',
    category: '포지션',
    description: '빅블라인드보다 작은 블라인드를 내는 자리입니다.',
    aliases: ['small blind', '스몰블라인드', '블라인드'],
  },
  {
    term: 'BTN',
    english: 'Button',
    category: '포지션',
    description: '딜러 버튼 자리입니다. 플랍 이후 가장 늦게 행동해 유리합니다.',
    aliases: ['button', '버튼', '딜러'],
  },
  {
    term: '100BB',
    english: 'One Hundred Big Blinds',
    category: '스택/팟',
    description:
      '빅블라인드 100개 크기의 스택입니다. 블라인드가 1/2라면 200칩이 100BB입니다.',
    example: '100BB, 200BB',
    aliases: ['백비비', '스택 단위', 'big blinds', '200BB'],
  },
  {
    term: '유효 스택',
    english: 'Effective Stack',
    category: '스택/팟',
    description:
      '한 판에서 실제로 걸릴 수 있는 두 플레이어 중 더 작은 스택입니다.',
    example: '내 80BB vs 상대 40BB = 유효 40BB',
    aliases: ['effective stack', '이펙티브 스택'],
  },
  {
    term: '팟',
    english: 'Pot',
    category: '스택/팟',
    description: '현재 판에 모여 있는 칩 전체입니다.',
    aliases: ['pot', 'pot size', '팟사이즈'],
  },
  {
    term: '팟 오즈',
    english: 'Pot Odds',
    category: '스택/팟',
    description: '콜해야 하는 금액과 이겼을 때 가져갈 팟을 비교한 비율입니다.',
    example: '50 팟에 25 콜 = 25%',
    aliases: ['pot odds', '오즈', '가격'],
  },
  {
    term: 'SPR',
    english: 'Stack-to-Pot Ratio',
    category: '스택/팟',
    description:
      '플랍 이후 남은 유효 스택을 현재 팟으로 나눈 값입니다. 낮을수록 올인까지 빨라집니다.',
    aliases: ['stack to pot ratio', '스택 팟 비율'],
  },
  {
    term: '폴드',
    english: 'Fold',
    category: '액션/베팅',
    description: '패를 버리고 이번 팟을 포기하는 액션입니다.',
    aliases: ['fold', '다이'],
  },
  {
    term: '체크',
    english: 'Check',
    category: '액션/베팅',
    description: '추가 베팅 없이 차례를 넘기는 액션입니다.',
    aliases: ['check'],
  },
  {
    term: '콜',
    english: 'Call',
    category: '액션/베팅',
    description: '상대의 베팅이나 레이즈 금액을 맞추는 액션입니다.',
    aliases: ['call', '따라가기'],
  },
  {
    term: '베팅',
    english: 'Bet',
    category: '액션/베팅',
    description: '아직 베팅이 없는 스트리트에서 처음 칩을 거는 액션입니다.',
    aliases: ['bet', '벳'],
  },
  {
    term: '레이즈',
    english: 'Raise',
    category: '액션/베팅',
    description: '상대 베팅보다 더 크게 올리는 액션입니다.',
    aliases: ['raise', '레이징'],
  },
  {
    term: '3-bet',
    category: '액션/베팅',
    description: '누군가 레이즈한 뒤 다시 리레이즈하는 액션입니다.',
    aliases: ['쓰리벳', '리레이즈', 'three bet'],
  },
  {
    term: '4-bet',
    category: '액션/베팅',
    description: '3-bet에 다시 레이즈하는 액션입니다.',
    aliases: ['포벳', 'four bet'],
  },
  {
    term: '올인',
    english: 'All-in',
    category: '액션/베팅',
    description: '가진 칩을 모두 거는 액션입니다.',
    aliases: ['all in', 'shove', '잼', '셔브'],
  },
  {
    term: '림프',
    english: 'Limp',
    category: '액션/베팅',
    description:
      '프리플랍에서 레이즈하지 않고 빅블라인드 금액만 콜하는 액션입니다.',
    aliases: ['limp', '림퍼'],
  },
  {
    term: 'C-bet',
    english: 'Continuation Bet',
    category: '액션/베팅',
    description: '프리플랍 공격자가 플랍 이후에도 이어서 하는 베팅입니다.',
    aliases: ['컨티뉴에이션 베팅', '씨벳', 'cbet'],
  },
  {
    term: '체크 레이즈',
    english: 'Check-raise',
    category: '액션/베팅',
    description: '먼저 체크한 뒤 상대 베팅에 레이즈하는 액션입니다.',
    aliases: ['check raise', '첵레이즈'],
  },
  {
    term: '오버벳',
    english: 'Overbet',
    category: '액션/베팅',
    description: '현재 팟보다 큰 금액을 베팅하는 액션입니다.',
    aliases: ['overbet', '팟 오버'],
  },
  {
    term: '레인지',
    english: 'Range',
    category: '기본 개념',
    description: '상대가 가질 수 있는 핸드들의 묶음입니다.',
    aliases: ['range', '핸드 범위'],
  },
  {
    term: '에쿼티',
    english: 'Equity',
    category: '기본 개념',
    description:
      '현재 상황에서 쇼다운까지 갔을 때 이길 확률에 가까운 개념입니다.',
    aliases: ['equity', '승률'],
  },
  {
    term: '넛츠',
    english: 'Nuts',
    category: '기본 개념',
    description: '현재 보드에서 만들 수 있는 가장 강한 핸드입니다.',
    aliases: ['nuts', '넛'],
  },
  {
    term: '키커',
    english: 'Kicker',
    category: '기본 개념',
    description: '같은 족보끼리 비교할 때 승패를 가르는 보조 카드입니다.',
    aliases: ['kicker', '보조 카드'],
  },
  {
    term: '블로커',
    english: 'Blocker',
    category: '기본 개념',
    description:
      '내가 들고 있어서 상대가 특정 강한 핸드를 가질 조합을 줄이는 카드입니다.',
    aliases: ['blocker', '블락커'],
  },
  {
    term: '밸류벳',
    english: 'Value Bet',
    category: '기본 개념',
    description: '더 약한 핸드에게 콜을 받기 위해 강한 핸드로 하는 베팅입니다.',
    aliases: ['value bet', '밸류 베팅'],
  },
  {
    term: '블러프',
    english: 'Bluff',
    category: '기본 개념',
    description:
      '더 좋은 핸드를 폴드시키기 위해 약한 핸드나 미완성 핸드로 하는 베팅입니다.',
    aliases: ['bluff', '뻥카'],
  },
  {
    term: '쇼다운',
    english: 'Showdown',
    category: '기본 개념',
    description:
      '마지막 베팅 라운드 후 남은 플레이어가 카드를 공개해 승부를 가리는 단계입니다.',
    aliases: ['showdown', '카드 오픈'],
  },
  {
    term: '플랍',
    english: 'Flop',
    category: '보드/드로우',
    description: '처음 공개되는 커뮤니티 카드 3장입니다.',
    aliases: ['flop'],
  },
  {
    term: '턴',
    english: 'Turn',
    category: '보드/드로우',
    description: '네 번째로 공개되는 커뮤니티 카드입니다.',
    aliases: ['turn', '4th street'],
  },
  {
    term: '리버',
    english: 'River',
    category: '보드/드로우',
    description: '다섯 번째이자 마지막 커뮤니티 카드입니다.',
    aliases: ['river', '5th street'],
  },
  {
    term: '보드 텍스처',
    english: 'Board Texture',
    category: '보드/드로우',
    description:
      '보드가 드로우가 많은지, 페어가 있는지, 높은 카드 중심인지 같은 구조입니다.',
    aliases: ['board texture', '텍스처', '드라이 보드', '웻 보드'],
  },
  {
    term: '레인보우',
    english: 'Rainbow',
    category: '보드/드로우',
    description: '플랍 세 장의 무늬가 모두 다른 보드입니다.',
    aliases: ['rainbow'],
  },
  {
    term: '모노톤',
    english: 'Monotone',
    category: '보드/드로우',
    description: '플랍 세 장의 무늬가 모두 같은 보드입니다.',
    aliases: ['monotone', '원톤'],
  },
  {
    term: '페어드 보드',
    english: 'Paired Board',
    category: '보드/드로우',
    description: '커뮤니티 카드에 같은 숫자가 2장 이상 있는 보드입니다.',
    aliases: ['paired board', '페어 보드'],
  },
  {
    term: '플러시 드로우',
    english: 'Flush Draw',
    category: '보드/드로우',
    description:
      '같은 무늬 카드가 한 장 더 나오면 플러시가 완성되는 상태입니다.',
    aliases: ['flush draw', '플러쉬 드로우'],
  },
  {
    term: 'OESD',
    english: 'Open-ended Straight Draw',
    category: '보드/드로우',
    description:
      '양쪽 끝 숫자 중 하나가 나오면 스트레이트가 완성되는 드로우입니다.',
    aliases: ['오픈엔디드', 'open ended', '양차'],
  },
  {
    term: '것샷',
    english: 'Gutshot',
    category: '보드/드로우',
    description:
      '가운데 빈 숫자 한 장이 나오면 스트레이트가 완성되는 드로우입니다.',
    aliases: ['gutshot', '인사이드 스트레이트 드로우'],
  },
  {
    term: '아웃츠',
    english: 'Outs',
    category: '보드/드로우',
    description:
      '내 핸드를 이기는 핸드로 개선해 줄 수 있는 남은 카드 수입니다.',
    aliases: ['outs', '아웃'],
  },
  {
    term: '백도어',
    english: 'Backdoor',
    category: '보드/드로우',
    description:
      '턴과 리버에 필요한 카드가 연속으로 나와야 완성되는 약한 드로우입니다.',
    aliases: ['backdoor', '러너러너'],
  },
  {
    term: '홀 카드',
    english: 'Hole Cards',
    category: '게임/테이블',
    description: '각 플레이어에게 비공개로 주어지는 개인 카드 2장입니다.',
    aliases: ['hole cards', '핸드', '내 패'],
  },
  {
    term: '커뮤니티 카드',
    english: 'Community Cards',
    category: '게임/테이블',
    description: '모든 플레이어가 함께 사용하는 공개 카드입니다.',
    aliases: ['community cards', '보드', 'board'],
  },
  {
    term: '번 카드',
    english: 'Burn Card',
    category: '게임/테이블',
    description:
      '플랍, 턴, 리버를 열기 전에 덱 맨 위에서 따로 버리는 카드입니다.',
    aliases: ['burn card', '버닝'],
  },
  {
    term: '딜러',
    english: 'Dealer',
    category: '게임/테이블',
    description:
      '카드를 나누고 게임 진행을 관리하는 사람입니다. 버튼 자리 자체를 뜻할 때도 있습니다.',
    aliases: ['dealer'],
  },
  {
    term: '바이인',
    english: 'Buy-in',
    category: '게임/테이블',
    description: '게임이나 토너먼트에 참가하기 위해 내는 금액입니다.',
    aliases: ['buy in', 'buy-in'],
  },
  {
    term: '캐시 게임',
    english: 'Cash Game',
    category: '게임/테이블',
    description:
      '칩이 실제 금액과 연결되고 원하는 때에 참가하거나 떠날 수 있는 게임입니다.',
    aliases: ['cash game', '링게임'],
  },
  {
    term: '토너먼트',
    english: 'Tournament',
    category: '게임/테이블',
    description:
      '정해진 참가비로 시작해 탈락자를 만들며 최종 순위를 가리는 방식입니다.',
    aliases: ['tournament', 'MTT'],
  },
  {
    term: '앤티',
    english: 'Ante',
    category: '스택/팟',
    description:
      '블라인드와 별도로 모든 플레이어가 매 핸드 내는 작은 강제 베팅입니다.',
    aliases: ['ante'],
  },
  {
    term: '메인 팟',
    english: 'Main Pot',
    category: '스택/팟',
    description:
      '올인한 플레이어가 있을 때 모든 참가자가 공통으로 겨루는 기본 팟입니다.',
    aliases: ['main pot'],
  },
  {
    term: '사이드 팟',
    english: 'Side Pot',
    category: '스택/팟',
    description:
      '올인한 플레이어보다 더 많은 칩을 가진 플레이어들끼리 추가로 겨루는 팟입니다.',
    aliases: ['side pot'],
  },
  {
    term: '스택',
    english: 'Stack',
    category: '스택/팟',
    description: '현재 플레이어가 가진 칩의 총량입니다.',
    aliases: ['stack', '칩'],
  },
  {
    term: '숏 스택',
    english: 'Short Stack',
    category: '스택/팟',
    description:
      '테이블 평균이나 블라인드에 비해 칩이 적은 상태입니다. 보통 선택지가 올인 또는 폴드 쪽으로 좁아집니다.',
    aliases: ['short stack', '숏스택'],
  },
  {
    term: '레이크',
    english: 'Rake',
    category: '스택/팟',
    description: '캐시 게임에서 운영자가 팟에서 가져가는 수수료입니다.',
    aliases: ['rake'],
  },
  {
    term: '스트래들',
    english: 'Straddle',
    category: '액션/베팅',
    description:
      '카드를 보기 전에 빅블라인드보다 큰 금액을 선택적으로 내는 프리플랍 베팅입니다.',
    aliases: ['straddle', '스트레들'],
  },
  {
    term: '스틸',
    english: 'Steal',
    category: '액션/베팅',
    description:
      '늦은 포지션에서 블라인드나 앤티를 가져가기 위해 레이즈하는 플레이입니다.',
    aliases: ['steal', '블라인드 스틸'],
  },
  {
    term: '세미 블러프',
    english: 'Semi-bluff',
    category: '액션/베팅',
    description:
      '지금은 약하지만 드로우가 완성되면 강해질 수 있는 핸드로 하는 베팅입니다.',
    aliases: ['semi bluff', '세미블러프'],
  },
  {
    term: '스냅 콜',
    english: 'Snap Call',
    category: '액션/베팅',
    description: '상대 베팅에 거의 고민 없이 바로 콜하는 액션입니다.',
    aliases: ['snap call'],
  },
  {
    term: '크라잉 콜',
    english: 'Crying Call',
    category: '액션/베팅',
    description:
      '질 가능성이 높다고 느끼면서도 팟 오즈나 정보 때문에 하는 어려운 콜입니다.',
    aliases: ['crying call'],
  },
  {
    term: '노 리밋',
    english: 'No Limit',
    category: '기본 개념',
    description:
      '자신의 스택 한도 안에서 원하는 만큼 베팅할 수 있는 방식입니다.',
    aliases: ['no limit', 'NLH', '노리밋'],
  },
  {
    term: 'EV',
    english: 'Expected Value',
    category: '기본 개념',
    description:
      '같은 선택을 장기적으로 반복했을 때 기대되는 평균 결과값입니다.',
    aliases: ['기댓값', 'expected value'],
  },
  {
    term: '임플라이드 오즈',
    english: 'Implied Odds',
    category: '기본 개념',
    description:
      '드로우가 완성됐을 때 이후 스트리트에서 추가로 얻을 수 있는 칩까지 고려한 오즈입니다.',
    aliases: ['implied odds'],
  },
  {
    term: '헤즈업',
    english: 'Heads-up',
    category: '기본 개념',
    description: '두 명만 남아 플레이하는 상황입니다.',
    aliases: ['heads up', 'HU'],
  },
  {
    term: '찹',
    english: 'Chop',
    category: '기본 개념',
    description:
      '승부가 같아 팟을 나누는 상황입니다. 스플릿 팟이라고도 부릅니다.',
    aliases: ['chop', '스플릿 팟', 'split pot', '보드 찹'],
  },
  {
    term: '드로잉 데드',
    english: 'Drawing Dead',
    category: '기본 개념',
    description: '남은 카드가 무엇이 나오더라도 이길 수 없는 상태입니다.',
    aliases: ['drawing dead'],
  },
  {
    term: '텔',
    english: 'Tell',
    category: '기본 개념',
    description:
      '상대의 핸드나 의도를 추정하게 해 주는 행동, 습관, 베팅 패턴입니다.',
    aliases: ['tell'],
  },
  {
    term: '탑 페어',
    english: 'Top Pair',
    category: '보드/드로우',
    description:
      '보드의 가장 높은 카드와 내 홀 카드 한 장이 같은 숫자로 만든 원페어입니다.',
    aliases: ['top pair'],
  },
  {
    term: '바텀 페어',
    english: 'Bottom Pair',
    category: '보드/드로우',
    description:
      '보드의 가장 낮은 카드와 내 홀 카드 한 장이 같은 숫자로 만든 원페어입니다.',
    aliases: ['bottom pair'],
  },
  {
    term: '오버 페어',
    english: 'Overpair',
    category: '보드/드로우',
    description: '내 포켓 페어가 보드의 모든 카드보다 높은 페어인 상태입니다.',
    aliases: ['over pair', 'overpair'],
  },
  {
    term: '오버 카드',
    english: 'Overcard',
    category: '보드/드로우',
    description:
      '현재 보드 카드들보다 높은 내 홀 카드입니다. 맞으면 탑페어가 될 수 있습니다.',
    aliases: ['over card', 'overcard'],
  },
  {
    term: '드라이 보드',
    english: 'Dry Board',
    category: '보드/드로우',
    description:
      '스트레이트나 플러시 드로우가 적어 강한 족보가 잘 만들어지지 않는 보드입니다.',
    aliases: ['dry board'],
  },
  {
    term: '웻 보드',
    english: 'Wet Board',
    category: '보드/드로우',
    description:
      '스트레이트나 플러시 드로우가 많아 핸드 변화 가능성이 큰 보드입니다.',
    aliases: ['wet board'],
  },
  {
    term: '어그레시브',
    english: 'Aggressive',
    category: '플레이 스타일',
    description: '체크와 콜보다 베팅과 레이즈를 자주 쓰는 공격적인 성향입니다.',
    aliases: ['aggressive'],
  },
  {
    term: '패시브',
    english: 'Passive',
    category: '플레이 스타일',
    description: '베팅과 레이즈보다 체크와 콜을 자주 쓰는 수동적인 성향입니다.',
    aliases: ['passive'],
  },
  {
    term: '타이트',
    english: 'Tight',
    category: '플레이 스타일',
    description: '강한 핸드 위주로 적은 팟에 참가하는 성향입니다.',
    aliases: ['tight'],
  },
  {
    term: '루즈',
    english: 'Loose',
    category: '플레이 스타일',
    description: '넓은 핸드 범위로 많은 팟에 참가하는 성향입니다.',
    aliases: ['loose'],
  },
  {
    term: '틸트',
    english: 'Tilt',
    category: '플레이 스타일',
    description: '감정이 흔들려 평소보다 무리한 판단을 하는 상태입니다.',
    aliases: ['tilt'],
  },
  {
    term: '배드빗',
    english: 'Bad Beat',
    category: '플레이 스타일',
    description:
      '크게 앞선 상황에서 낮은 확률의 카드에 역전당해 지는 상황입니다.',
    aliases: ['bad beat'],
  },
];

const categoriesByTab: Record<GuideTab, string[]> = {
  hands: ['족보'],
  terms: [
    '핸드 표기',
    '패 별칭',
    '포지션',
    '스택/팟',
    '액션/베팅',
    '기본 개념',
    '보드/드로우',
    '게임/테이블',
    '플레이 스타일',
  ],
};

const tabs: { id: GuideTab; label: string }[] = [
  { id: 'hands', label: '족보' },
  { id: 'terms', label: '용어설명' },
];

const normalize = (value: string) => value.trim().toLocaleLowerCase();

function matchesEntry(entry: GuideEntry, query: string) {
  const text = normalize(
    [
      entry.term,
      entry.english,
      entry.description,
      entry.example,
      ...entry.aliases,
    ]
      .filter(Boolean)
      .join(' '),
  );

  return text.includes(query);
}

function EntryCard({
  entry,
  highlighted,
  refCallback,
}: {
  entry: GuideEntry;
  highlighted?: boolean;
  refCallback?: (element: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={refCallback}
      className={`surface rounded-[1rem] p-4 transition ${
        highlighted
          ? 'ring-2 ring-[var(--mint-400)] ring-offset-2 ring-offset-[var(--felt-950)]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold">{entry.term}</h3>
          {entry.english ? (
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--clay-300)]">
              {entry.english}
            </p>
          ) : null}
        </div>
        {entry.example ? (
          <span className="chip shrink-0 px-2.5 py-1 text-xs font-black">
            {entry.example}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--ink-300)]">
        {entry.description}
      </p>
      {entry.cards ? (
        <fieldset
          aria-label={`${entry.term} 예시 카드`}
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {entry.cards.map((card, index) => (
            <Card key={`${entry.term}-${card}-${index}`} value={card} />
          ))}
        </fieldset>
      ) : null}
    </article>
  );
}

type GuideScreenProps = {
  targetTerm?: string | null;
  onReturnToQuestion?: () => void;
};

export function GuideScreen({
  targetTerm = null,
  onReturnToQuestion,
}: GuideScreenProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<GuideTab>(
    targetTerm ? 'terms' : 'hands',
  );
  const entryRefs = useRef(new Map<string, HTMLElement>());
  const normalizedQuery = normalize(query);
  const tabCategories = categoriesByTab[activeTab];
  const targetEntry = targetTerm
    ? guideEntries.find((entry) => entry.term === targetTerm)
    : undefined;
  const visibleEntries = useMemo(() => {
    const tabEntries = guideEntries.filter((entry) =>
      tabCategories.includes(entry.category),
    );

    if (!normalizedQuery) {
      return tabEntries;
    }

    return tabEntries.filter((entry) => matchesEntry(entry, normalizedQuery));
  }, [normalizedQuery, tabCategories]);

  useEffect(() => {
    if (!targetEntry) {
      return;
    }

    setActiveTab('terms');
    setQuery('');
  }, [targetEntry]);

  useEffect(() => {
    if (!targetEntry || activeTab !== 'terms' || normalizedQuery) {
      return;
    }

    const element = entryRefs.current.get(targetEntry.term);
    element?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  }, [activeTab, normalizedQuery, targetEntry]);

  return (
    <section className="rise-in space-y-6">
      <div>
        {onReturnToQuestion ? (
          <button
            type="button"
            onClick={onReturnToQuestion}
            className="chip mb-5 flex items-center gap-2 px-3 py-2 text-sm font-bold transition hover:bg-[oklch(86%_0.018_94_/_0.06)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            문제로 돌아가기
          </button>
        ) : null}
        <p className="eyebrow">Beginner Guide</p>
        <h1 className="font-display mt-3 text-[2rem] font-bold leading-tight">
          홀덤 가이드
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          족보, 핸드 표기, 포지션과 기본 용어를 빠르게 확인합니다.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="가이드 종류"
        className="grid grid-cols-2 gap-2"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`min-h-11 rounded-[0.85rem] px-3 text-sm font-black transition ${
                selected
                  ? 'tab-active'
                  : 'surface text-[var(--ink-300)] hover:text-[var(--ink-100)]'
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setQuery('');
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-bold text-[var(--ink-300)]">
          용어 검색
        </span>
        <span className="surface flex min-h-12 items-center gap-2 rounded-[0.85rem] px-3">
          <Search
            aria-hidden="true"
            className="size-4 text-[var(--clay-300)]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="BB, 에어라인, 풀하우스"
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[var(--ink-100)] placeholder:text-[var(--ink-300)] focus:outline-none"
          />
        </span>
      </label>

      {normalizedQuery ? (
        <section aria-labelledby="guide-search-heading" className="space-y-3">
          <h2 id="guide-search-heading" className="eyebrow">
            검색 결과
          </h2>
          {visibleEntries.length > 0 ? (
            visibleEntries.map((entry) => (
              <EntryCard
                key={`${entry.category}-${entry.term}`}
                entry={entry}
                highlighted={entry.term === targetEntry?.term}
                refCallback={(element) => {
                  if (element) {
                    entryRefs.current.set(entry.term, element);
                  } else {
                    entryRefs.current.delete(entry.term);
                  }
                }}
              />
            ))
          ) : (
            <p className="surface rounded-[1rem] p-5 text-sm font-bold text-[var(--ink-300)]">
              일치하는 항목이 없습니다.
            </p>
          )}
        </section>
      ) : (
        tabCategories.map((category) => {
          const categoryEntries = visibleEntries.filter(
            (entry) => entry.category === category,
          );

          if (categoryEntries.length === 0) {
            return null;
          }

          return (
            <section
              key={category}
              aria-labelledby={`guide-${category}`}
              className="space-y-3"
            >
              <h2 id={`guide-${category}`} className="eyebrow">
                {category}
              </h2>
              <div className="space-y-3">
                {categoryEntries.map((entry) => (
                  <EntryCard
                    key={`${entry.category}-${entry.term}`}
                    entry={entry}
                    highlighted={entry.term === targetEntry?.term}
                    refCallback={(element) => {
                      if (element) {
                        entryRefs.current.set(entry.term, element);
                      } else {
                        entryRefs.current.delete(entry.term);
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}
