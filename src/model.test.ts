import { describe, expect, it } from 'vitest';
import { accuracy, misconceptionCounts, newDrill, parseImport, shuffle, validateDrill } from './model';
import type { Attempt } from './types';

describe('drill model', () => {
  it('creates an editable drill and reports missing authoring details', () => {
    const drill = newDrill();
    expect(drill.nodes).toHaveLength(1);
    expect(drill.nodes[0]?.choices).toHaveLength(2);
    expect(validateDrill(drill)).toEqual([]);
    drill.nodes[0]!.prompt = '';
    drill.nodes[0]!.choices[0]!.label = '';
    expect(validateDrill(drill)).toContain('Decision 1 needs a prompt.');
    expect(validateDrill(drill)).toContain('Decision 1 has a choice without a label.');
  });

  it('uses an injectable random source when shuffling', () => {
    expect(shuffle(['a', 'b', 'c'], () => 0)).toEqual(['b', 'c', 'a']);
  });

  it('calculates accuracy and misconception counts', () => {
    const attempts: Attempt[] = [{
      id: 'a1', drillId: 'd1', startedAt: '2026-01-01', completedAt: '2026-01-01',
      selections: [
        { nodeId: 'n1', choiceId: 'c1', correct: true, misconception: '' },
        { nodeId: 'n2', choiceId: 'c2', correct: false, misconception: 'Skipped verification' }
      ]
    }, {
      id: 'a2', drillId: 'd1', startedAt: '2026-01-02', completedAt: '2026-01-02',
      selections: [{ nodeId: 'n1', choiceId: 'c3', correct: false, misconception: 'Skipped verification' }]
    }];
    expect(accuracy(attempts[0]!)).toBe(50);
    expect(misconceptionCounts(attempts)).toEqual([['Skipped verification', 2]]);
  });

  it('rejects malformed imports', () => {
    expect(() => parseImport('{"drills":[]}')).toThrow(/drills and attempts/);
    expect(parseImport('{"drills":[],"attempts":[]}')).toEqual({ drills: [], attempts: [] });
  });
});
