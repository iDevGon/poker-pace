import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders corner ranks with a single center suit', () => {
    render(<Card value="A♠" />);

    const card = screen.getByLabelText('A♠');

    expect(card).toHaveClass('aspect-[5/7]');
    expect(screen.getAllByText('A')).toHaveLength(2);
    expect(screen.getAllByText('♠')).toHaveLength(1);
  });
});
