import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomTabs } from './BottomTabs';

describe('BottomTabs', () => {
  it('uses safe-area aware spacing at the bottom of the viewport', () => {
    render(<BottomTabs activeTab="today" onChange={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: /주요 화면/i })).toHaveClass(
      'bottom-nav',
    );
  });

  it('does not expose the tournament checklist tab', () => {
    render(<BottomTabs activeTab="today" onChange={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /대회/i })).toBeNull();
  });

  it('exposes the guide tab', () => {
    render(<BottomTabs activeTab="today" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /가이드/i })).toBeInTheDocument();
  });
});
