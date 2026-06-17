import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

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

  it('persists tournament checklist selections after reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: /대회/i }));
    await user.click(screen.getByRole('checkbox', { name: /시작 칩/i }));
    unmount();

    render(<App />);
    await user.click(screen.getByRole('button', { name: /대회/i }));

    expect(screen.getByRole('checkbox', { name: /시작 칩/i })).toBeChecked();
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
