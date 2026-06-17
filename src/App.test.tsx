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

    expect(screen.getByText(/Week 1 Day 1/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start lesson/i }),
    ).toBeInTheDocument();
  });

  it('exposes primary structure and current progress to assistive technology', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: /skip to content/i }),
    ).toHaveAttribute('href', '#main-content');
    expect(
      screen.getByRole('navigation', { name: /primary/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^today$/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('progressbar', { name: /course progress/i }),
    ).toHaveAttribute('aria-valuenow', '0');
  });

  it('lets the user answer a quiz and see an explanation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /start lesson/i }));
    await user.click(screen.getByRole('button', { name: /begin quiz/i }));
    await user.click(screen.getByRole('button', { name: /fold/i }));

    expect(screen.getByText(/explanation/i)).toBeInTheDocument();
  });

  it('persists tournament checklist selections after reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: /tournament/i }));
    await user.click(screen.getByRole('checkbox', { name: /starting chips/i }));
    unmount();

    render(<App />);
    await user.click(screen.getByRole('button', { name: /tournament/i }));

    expect(
      screen.getByRole('checkbox', { name: /starting chips/i }),
    ).toBeChecked();
  });

  it('shows an empty missed-question trainer state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /trainer/i }));

    expect(screen.getByText(/No missed questions yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /random 10 questions/i }),
    ).toBeInTheDocument();
  });

  it('opens the GTO wizard and shows hand action frequencies', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^gto$/i }));
    await user.click(screen.getByRole('button', { name: /AJs/i }));

    expect(
      screen.getByRole('heading', { name: /GTO Wizard Lite/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Raise 70%/i)).toBeInTheDocument();
    expect(screen.getByText(/Call 20%/i)).toBeInTheDocument();
    expect(screen.getByText(/Fold 10%/i)).toBeInTheDocument();
    expect(screen.getByText(/3-bet이 잦으면/i)).toBeInTheDocument();
  });
});
