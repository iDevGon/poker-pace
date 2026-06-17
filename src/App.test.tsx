import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { LessonScreen } from './screens/LessonScreen';

describe('Poker Pace app', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the recommended first lesson', () => {
    render(<App />);

    expect(screen.getByText(/1주차 1일차/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /학습 시작/i }),
    ).toBeInTheDocument();
  });

  it('exposes primary structure and current progress to assistive technology', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: /본문으로 건너뛰기/i }),
    ).toHaveAttribute('href', '#main-content');
    expect(
      screen.getByRole('navigation', { name: /주요 화면/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^오늘$/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('progressbar', { name: /코스 진행률/i }),
    ).toHaveAttribute('aria-valuenow', '0');
  });

  it('lets the user answer a quiz and see an explanation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /학습 시작/i }));
    await user.click(screen.getByRole('button', { name: /퀴즈 시작/i }));
    await user.click(screen.getByRole('button', { name: /fold/i }));

    expect(screen.getByText(/해설/i)).toBeInTheDocument();
  });

  it('shows card visuals again inside the quiz explanation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /학습 시작/i }));
    await user.click(screen.getByRole('button', { name: /퀴즈 시작/i }));
    await user.click(screen.getByRole('button', { name: /fold/i }));

    const explanationCards = screen.getByLabelText('해설 카드 예시');
    expect(explanationCards).toHaveTextContent('7♣');
    expect(explanationCards).toHaveTextContent('2♦');
  });

  it('separates hole cards from community cards in quiz card visuals', async () => {
    const user = userEvent.setup();
    render(
      <LessonScreen
        unit={{
          id: 'test-unit',
          week: 1,
          day: 1,
          title: '카드 구분',
          goal: '내 패와 커뮤니티 카드를 구분합니다.',
          estimatedMinutes: 1,
          lessonBlocks: [],
          quizIds: ['q-hand-rank-1'],
        }}
        onBack={vi.fn()}
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /퀴즈 시작/i }));

    const holeCards = screen.getByLabelText('문제 내 패 카드');
    const communityCards = screen.getByLabelText('문제 커뮤니티 카드');

    expect(holeCards).toHaveTextContent('A♠');
    expect(holeCards).toHaveTextContent('K♠');
    expect(communityCards).toHaveTextContent('A♦');
    expect(communityCards).toHaveTextContent('9♣');
    expect(communityCards).toHaveTextContent('4♥');
    expect(communityCards).toHaveTextContent('2♠');
    expect(communityCards).toHaveTextContent('2♣');
  });

  it('shows an empty missed-question trainer state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /복습/i }));

    expect(screen.getByText(/아직 틀린 문제가 없습니다/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /랜덤 10문제/i }),
    ).toBeInTheDocument();
  });

  it('opens the beginner guide with searchable hand and rank references', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /가이드/i }));

    expect(
      screen.getByRole('heading', { name: /홀덤 가이드/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /족보/i })).toBeInTheDocument();
    expect(screen.getByLabelText('풀하우스 예시 카드')).toHaveTextContent('K');

    await user.type(
      screen.getByRole('searchbox', { name: /용어 검색/i }),
      '에어라인',
    );

    expect(
      screen.getByRole('heading', { name: /검색 결과/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('에어라인')).toBeInTheDocument();
    expect(screen.getByText(/AA를 부르는 별칭/i)).toBeInTheDocument();
    expect(screen.queryByText('로열 플러시')).toBeNull();
  });

  it('shows an empty guide search state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /가이드/i }));
    await user.type(
      screen.getByRole('searchbox', { name: /용어 검색/i }),
      '없는용어',
    );

    expect(screen.getByText(/일치하는 항목이 없습니다/i)).toBeInTheDocument();
  });

  it('opens the GTO wizard and shows hand action frequencies', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^gto$/i }));
    await user.click(screen.getByRole('button', { name: /AJs/i }));

    expect(
      screen.getByRole('heading', { name: /GTO 기준표/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Raise 70%/i)).toBeInTheDocument();
    expect(screen.getByText(/Call 20%/i)).toBeInTheDocument();
    expect(screen.getByText(/Fold 10%/i)).toBeInTheDocument();
    expect(screen.getByText(/3-bet이 잦으면/i)).toBeInTheDocument();
  });

  it('groups GTO spots by category before selecting a situation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^gto$/i }));

    expect(screen.getByRole('button', { name: /Open 상황/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.getByRole('button', { name: /Defend 상황/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /UTG 오픈/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Defend 상황/i }));
    await user.click(screen.getByRole('button', { name: /BB 디펜스 vs CO/i }));

    expect(
      screen.getByRole('heading', { name: /BB 디펜스 vs CO/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /UTG 오픈/i })).toBeNull();
  });
});
