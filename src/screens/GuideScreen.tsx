import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '../components/Card';

type GuideEntry = {
  term: string;
  english?: string;
  category: string;
  description: string;
  example?: string;
  cards?: string[];
  aliases: string[];
};

const entries: GuideEntry[] = [
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
    description: '무늬와 상관없이 숫자가 5장 이어진 족보입니다.',
    cards: ['T♣', '9♥', '8♦', '7♠', '6♣'],
    aliases: ['straight', '줄'],
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
    term: 'BB',
    english: 'Big Blind',
    category: '포지션',
    description: '카드를 받기 전에 의무로 큰 블라인드를 내는 자리입니다.',
    aliases: ['big blind', '빅블라인드', '블라인드'],
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
    term: '3-bet',
    category: '액션/베팅',
    description: '누군가 레이즈한 뒤 다시 리레이즈하는 액션입니다.',
    aliases: ['쓰리벳', '리레이즈', 'three bet'],
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
];

const categories = [
  '족보',
  '핸드 표기',
  '패 별칭',
  '포지션',
  '액션/베팅',
  '기본 개념',
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

function EntryCard({ entry }: { entry: GuideEntry }) {
  return (
    <article className="surface rounded-[1rem] p-4">
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

export function GuideScreen() {
  const [query, setQuery] = useState('');
  const normalizedQuery = normalize(query);
  const visibleEntries = useMemo(() => {
    if (!normalizedQuery) {
      return entries;
    }

    return entries.filter((entry) => matchesEntry(entry, normalizedQuery));
  }, [normalizedQuery]);

  return (
    <section className="rise-in space-y-6">
      <div>
        <p className="eyebrow">Beginner Guide</p>
        <h1 className="font-display mt-3 text-[2rem] font-bold leading-tight">
          홀덤 가이드
        </h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-300)]">
          족보, 핸드 표기, 포지션과 기본 용어를 빠르게 확인합니다.
        </p>
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
              />
            ))
          ) : (
            <p className="surface rounded-[1rem] p-5 text-sm font-bold text-[var(--ink-300)]">
              일치하는 항목이 없습니다.
            </p>
          )}
        </section>
      ) : (
        categories.map((category) => {
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
