import { describe, expect, it } from 'vitest';
import config from '../public/staticwebapp.config.json';

describe('static deployment response policy', () => {
  it('serves fingerprinted assets immutably while keeping the app shell and worker fresh', () => {
    const route = (path: string) => config.routes.find((item) => item.route === path);
    expect(route('/assets/*')?.headers['cache-control']).toBe('public, max-age=31536000, immutable');
    expect(route('/sw.js')?.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
    expect(route('/')?.headers['cache-control']).toBe('no-cache, must-revalidate');
    expect(route('/assets/decision-board-*.webp')?.headers['cache-control']).toBe('public, max-age=3600, must-revalidate');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.globalHeaders['Cross-Origin-Opener-Policy']).toBe('same-origin');
  });
});
