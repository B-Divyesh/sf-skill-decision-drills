const origin = 'https://skill-decision-drills.sociobot.in';
const expect = (condition, message) => { if (!condition) throw new Error(message); };

for (const [path, title] of [
  ['/', 'Skill Decision Drills — Rehearse real decisions'],
  ['/demo', 'Demo — Skill Decision Drills'],
  ['/privacy/', 'Privacy — Skill Decision Drills'],
  ['/terms/', 'Terms — Skill Decision Drills']
]) {
  const response = await fetch(`${origin}${path}`);
  expect(response.ok, `${path} returned HTTP ${response.status}.`);
  const html = await response.text();
  expect(html.includes('<html lang="en"'), `${path} is missing lang="en".`);
  expect(html.includes(`<title>${title}</title>`) || path === '/demo', `${path} has the wrong static title.`);
}

const headers = await fetch(origin, { method: 'HEAD' });
expect(headers.headers.get('content-security-policy'), 'Missing Content-Security-Policy.');
expect(headers.headers.get('permissions-policy'), 'Missing Permissions-Policy.');
expect(headers.headers.get('cross-origin-opener-policy') === 'same-origin', 'Missing Cross-Origin-Opener-Policy.');
console.log('Live routes, metadata shell, and response hardening passed.');
