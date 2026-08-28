import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('documented claim commands', () => {
  it('lists every claim with the README command', () => {
    const readme = readFileSync('README.md', 'utf8');
    const command = readme.match(/```bash\n(node --input-type=module -e "[^"]*(?:"[^"]*"[^"]*)*")\n```/g)?.at(-1)
      ?.replace(/^```bash\n|\n```$/g, '');
    expect(command).toBeTruthy();
    const output = execFileSync('bash', ['-lc', command!], { encoding: 'utf8' }).trim().split('\n');
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ test: string }>;
    expect(output).toEqual(claims.map((claim) => claim.test));
  });
});
