import type { LicenseState } from './types';

const SLUG = 'skill-decision-drills';
const API_BASE = 'https://api.sociobot.in/api/v1';
const TOKEN_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;

type Verdict = { valid: boolean; checkedAt: number };

const cachedVerdict = (): Verdict | null => {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null;
  } catch {
    return null;
  }
};

export const checkoutUrl = `${API_BASE}/products/${SLUG}/checkout`;

export const captureLicenseFromUrl = (): void => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
};

export const getLicenseState = (): LicenseState => {
  const token = localStorage.getItem(TOKEN_KEY);
  const verdict = cachedVerdict();
  return {
    unlocked: Boolean(token && verdict?.valid),
    checking: false,
    notice: ''
  };
};

export const verifyLicense = async (force = false): Promise<LicenseState> => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { unlocked: false, checking: false, notice: '' };
  const verdict = cachedVerdict();
  if (!force && verdict && Date.now() - verdict.checkedAt < DAY) {
    return { unlocked: verdict.valid, checking: false, notice: verdict.valid ? '' : 'License no longer active.' };
  }
  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable.');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { unlocked: result.valid, checking: false, notice: result.valid ? '' : 'License no longer active.' };
  } catch {
    return {
      unlocked: Boolean(verdict?.valid),
      checking: false,
      notice: 'License check is offline. Using the last verified status.'
    };
  }
};

export const restoreLicense = async (token: string): Promise<LicenseState> => {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  return verifyLicense(true);
};
