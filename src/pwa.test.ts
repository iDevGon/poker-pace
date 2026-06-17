import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';
import manifestText from '../public/manifest.webmanifest?raw';
import serviceWorker from '../public/sw.js?raw';
import main from './main.tsx?raw';

describe('PWA metadata', () => {
  it('uses a descriptive browser title and app metadata links', () => {
    expect(html).toContain(
      '<title>Poker Pace - 4주 포커 학습 트레이너</title>',
    );
    expect(html).toContain(
      '<link rel="manifest" href="/manifest.webmanifest" />',
    );
    expect(html).toContain('<link rel="icon" href="/favicon.ico" />');
    expect(html).toContain(
      '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    );
  });

  it('defines installable app icons in the web app manifest', () => {
    const manifest = JSON.parse(manifestText);

    expect(manifest.name).toBe('Poker Pace');
    expect(manifest.short_name).toBe('Poker Pace');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        }),
        expect.objectContaining({
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        }),
      ]),
    );
  });

  it('registers a service worker for installed app support', () => {
    expect(main).toContain('navigator.serviceWorker.register');
    expect(main).toContain('/sw.js');
    expect(serviceWorker).toContain("const CACHE_NAME = 'poker-pace-v1'");
    expect(serviceWorker).toContain("'/manifest.webmanifest'");
  });
});
