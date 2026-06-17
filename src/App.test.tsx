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

  it('lets the user answer a quiz and see an explanation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /start lesson/i }));
    await user.click(screen.getByRole('button', { name: /begin quiz/i }));
    await user.click(screen.getByRole('button', { name: /fold/i }));

    expect(screen.getByText(/explanation/i)).toBeInTheDocument();
  });
});
