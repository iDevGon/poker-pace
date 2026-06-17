import { beforeEach, describe, expect, it } from 'vitest';
import { initialProgress } from './progress';
import { loadProgress, STORAGE_KEY, saveProgress } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial progress when storage is empty', () => {
    expect(loadProgress()).toEqual(initialProgress);
  });

  it('saves and loads progress', () => {
    saveProgress({ ...initialProgress, completedUnitIds: ['w1d1'] });
    expect(loadProgress().completedUnitIds).toEqual(['w1d1']);
  });

  it('ignores malformed storage', () => {
    localStorage.setItem(STORAGE_KEY, '{bad json');
    expect(loadProgress()).toEqual(initialProgress);
  });
});
