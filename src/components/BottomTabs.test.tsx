import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomTabs } from './BottomTabs';

describe('BottomTabs', () => {
  it('uses safe-area aware spacing at the bottom of the viewport', () => {
    render(<BottomTabs activeTab="today" onChange={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: /primary/i })).toHaveClass(
      'bottom-nav',
    );
  });
});
