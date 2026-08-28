import type { AppData, Attempt, Choice, Drill, DrillNode } from './types';

type UnknownRecord = Record<string, unknown>;

export class AppDataValidationError extends Error {
  constructor(source: 'backup' | 'saved data', detail: string) {
    super(`${source === 'backup' ? 'This backup' : 'Your saved data'} is not safe to open: ${detail}`);
    this.name = 'AppDataValidationError';
  }
}

const recordAt = (value: unknown, path: string, source: 'backup' | 'saved data'): UnknownRecord => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AppDataValidationError(source, `${path} must be an object.`);
  }
  return value as UnknownRecord;
};

const stringAt = (record: UnknownRecord, key: string, path: string, source: 'backup' | 'saved data'): string => {
  if (typeof record[key] !== 'string') {
    throw new AppDataValidationError(source, `${path}.${key} must be a string.`);
  }
  return record[key] as string;
};

const booleanAt = (record: UnknownRecord, key: string, path: string, source: 'backup' | 'saved data'): boolean => {
  if (typeof record[key] !== 'boolean') {
    throw new AppDataValidationError(source, `${path}.${key} must be true or false.`);
  }
  return record[key] as boolean;
};

const arrayAt = (record: UnknownRecord, key: string, path: string, source: 'backup' | 'saved data'): unknown[] => {
  if (!Array.isArray(record[key])) {
    throw new AppDataValidationError(source, `${path}.${key} must be an array.`);
  }
  return record[key] as unknown[];
};

const uniqueId = (id: string, seen: Set<string>, path: string, source: 'backup' | 'saved data'): void => {
  if (!id.trim()) throw new AppDataValidationError(source, `${path} must not be empty.`);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(id)) {
    throw new AppDataValidationError(source, `${path} contains unsupported characters.`);
  }
  if (seen.has(id)) throw new AppDataValidationError(source, `${path} is duplicated.`);
  seen.add(id);
};

export const validateAppData = (value: unknown, source: 'backup' | 'saved data' = 'backup'): AppData => {
  const root = recordAt(value, 'data', source);
  const rawDrills = arrayAt(root, 'drills', 'data', source);
  const rawAttempts = arrayAt(root, 'attempts', 'data', source);
  const drillIds = new Set<string>();

  const drills = rawDrills.map((rawDrill, drillIndex): Drill => {
    const path = `drills[${drillIndex}]`;
    const drill = recordAt(rawDrill, path, source);
    const id = stringAt(drill, 'id', path, source);
    uniqueId(id, drillIds, `${path}.id`, source);
    const title = stringAt(drill, 'title', path, source);
    const description = stringAt(drill, 'description', path, source);
    const createdAt = stringAt(drill, 'createdAt', path, source);
    const updatedAt = stringAt(drill, 'updatedAt', path, source);
    const startNodeId = stringAt(drill, 'startNodeId', path, source);
    const shuffleChoices = booleanAt(drill, 'shuffleChoices', path, source);
    const nodeIds = new Set<string>();
    const rawNodes = arrayAt(drill, 'nodes', path, source);

    const nodes = rawNodes.map((rawNode, nodeIndex): DrillNode => {
      const nodePath = `${path}.nodes[${nodeIndex}]`;
      const node = recordAt(rawNode, nodePath, source);
      const nodeId = stringAt(node, 'id', nodePath, source);
      uniqueId(nodeId, nodeIds, `${nodePath}.id`, source);
      const prompt = stringAt(node, 'prompt', nodePath, source);
      const hint = stringAt(node, 'hint', nodePath, source);
      const debrief = stringAt(node, 'debrief', nodePath, source);
      if (node.image !== undefined && typeof node.image !== 'string') {
        throw new AppDataValidationError(source, `${nodePath}.image must be a string when present.`);
      }
      const choiceIds = new Set<string>();
      const choices = arrayAt(node, 'choices', nodePath, source).map((rawChoice, choiceIndex): Choice => {
        const choicePath = `${nodePath}.choices[${choiceIndex}]`;
        const choice = recordAt(rawChoice, choicePath, source);
        const choiceId = stringAt(choice, 'id', choicePath, source);
        uniqueId(choiceId, choiceIds, `${choicePath}.id`, source);
        const nextNodeId = choice.nextNodeId;
        if (nextNodeId !== null && typeof nextNodeId !== 'string') {
          throw new AppDataValidationError(source, `${choicePath}.nextNodeId must be a string or null.`);
        }
        return {
          id: choiceId,
          label: stringAt(choice, 'label', choicePath, source),
          consequence: stringAt(choice, 'consequence', choicePath, source),
          nextNodeId,
          isCorrect: booleanAt(choice, 'isCorrect', choicePath, source),
          misconception: stringAt(choice, 'misconception', choicePath, source)
        };
      });
      return { id: nodeId, prompt, hint, debrief, choices, ...(node.image === undefined ? {} : { image: node.image }) };
    });

    if (nodes.length ? !nodeIds.has(startNodeId) : startNodeId !== '') {
      throw new AppDataValidationError(source, `${path}.startNodeId must identify a decision in this drill.`);
    }
    nodes.forEach((node, nodeIndex) => node.choices.forEach((choice, choiceIndex) => {
      if (choice.nextNodeId !== null && !nodeIds.has(choice.nextNodeId)) {
        throw new AppDataValidationError(source, `${path}.nodes[${nodeIndex}].choices[${choiceIndex}].nextNodeId identifies a missing decision.`);
      }
    }));
    return { id, title, description, createdAt, updatedAt, startNodeId, shuffleChoices, nodes };
  });

  const attemptIds = new Set<string>();
  const attempts = rawAttempts.map((rawAttempt, attemptIndex): Attempt => {
    const path = `attempts[${attemptIndex}]`;
    const attempt = recordAt(rawAttempt, path, source);
    const id = stringAt(attempt, 'id', path, source);
    uniqueId(id, attemptIds, `${path}.id`, source);
    const drillId = stringAt(attempt, 'drillId', path, source);
    if (!drillIds.has(drillId)) {
      throw new AppDataValidationError(source, `${path}.drillId identifies a missing drill.`);
    }
    const selections = arrayAt(attempt, 'selections', path, source).map((rawSelection, selectionIndex) => {
      const selectionPath = `${path}.selections[${selectionIndex}]`;
      const selection = recordAt(rawSelection, selectionPath, source);
      return {
        nodeId: stringAt(selection, 'nodeId', selectionPath, source),
        choiceId: stringAt(selection, 'choiceId', selectionPath, source),
        correct: booleanAt(selection, 'correct', selectionPath, source),
        misconception: stringAt(selection, 'misconception', selectionPath, source)
      };
    });
    return {
      id,
      drillId,
      startedAt: stringAt(attempt, 'startedAt', path, source),
      completedAt: stringAt(attempt, 'completedAt', path, source),
      selections
    };
  });

  return { drills, attempts };
};

export const uid = (prefix: string): string =>
  `${prefix}_${crypto.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`}`;

export const newChoice = (label = ''): Choice => ({
  id: uid('choice'),
  label,
  consequence: '',
  nextNodeId: null,
  isCorrect: false,
  misconception: ''
});

export const newNode = (position: number): DrillNode => ({
  id: uid('node'),
  prompt: `Decision ${position}`,
  hint: '',
  debrief: '',
  choices: [newChoice('Option A'), newChoice('Option B')]
});

export const newDrill = (): Drill => {
  const first = newNode(1);
  return {
    id: uid('drill'),
    title: 'Untitled decision drill',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startNodeId: first.id,
    shuffleChoices: true,
    nodes: [first]
  };
};

export const starterDrill = (): Drill => {
  const arrival = 'node_arrival';
  const clarify = 'node_clarify';
  const inspect = 'node_inspect';
  const close = 'node_close';
  return {
    id: 'starter_studio_handoff',
    title: 'Studio handoff: find the missing context',
    description: 'A safe sample about receiving an unfinished creative project. Practice clarifying before acting.',
    createdAt: '2026-08-28T00:00:00.000Z',
    updatedAt: '2026-08-28T00:00:00.000Z',
    startNodeId: arrival,
    shuffleChoices: true,
    nodes: [
      {
        id: arrival,
        prompt: 'A teammate hands you a folder called FINAL-2 and says, “Can you finish this before lunch?” What do you do first?',
        hint: 'Look for the decision that reduces ambiguity before work begins.',
        debrief: 'A fast handoff starts by agreeing on the outcome, not guessing from filenames.',
        choices: [
          { id: 'c_ask', label: 'Ask what “finished” means and who approves it', consequence: 'You uncover the deadline, format, and reviewer before making changes.', nextNodeId: clarify, isCorrect: true, misconception: '' },
          { id: 'c_open', label: 'Open the newest-looking file and start polishing', consequence: 'You move quickly, but may optimize the wrong version.', nextNodeId: inspect, isCorrect: false, misconception: 'Acting before confirming the goal' },
          { id: 'c_copy', label: 'Duplicate every file into a new folder', consequence: 'The source is preserved, but the actual handoff is still unclear.', nextNodeId: clarify, isCorrect: false, misconception: 'Treating file safety as task clarity' }
        ]
      },
      {
        id: clarify,
        prompt: 'The teammate says the reviewer wants “the approved layout with updated captions.” Which follow-up is most useful?',
        hint: 'Ask for evidence that identifies both the version and the change.',
        debrief: 'Concrete references make handoffs auditable and repeatable.',
        choices: [
          { id: 'c_reference', label: 'Ask for the approved reference and the caption source', consequence: 'You now have a visual baseline and authoritative copy.', nextNodeId: close, isCorrect: true, misconception: '' },
          { id: 'c_taste', label: 'Ask which layout they personally like best', consequence: 'Preference does not identify what was approved.', nextNodeId: inspect, isCorrect: false, misconception: 'Substituting preference for evidence' }
        ]
      },
      {
        id: inspect,
        prompt: 'Two files have nearly identical timestamps. What is the strongest next move?',
        hint: 'Make the difference visible, then verify it with the owner.',
        debrief: 'Version ambiguity should be resolved explicitly, not inferred from tiny metadata differences.',
        choices: [
          { id: 'c_compare', label: 'Compare them, note the differences, and confirm with the teammate', consequence: 'You turn uncertainty into a short, answerable question.', nextNodeId: close, isCorrect: true, misconception: '' },
          { id: 'c_timestamp', label: 'Assume the later timestamp is approved', consequence: 'A later save can still be an experiment or accidental edit.', nextNodeId: close, isCorrect: false, misconception: 'Trusting metadata without confirmation' }
        ]
      },
      {
        id: close,
        prompt: 'You have the approved source and caption changes. How do you close the handoff loop?',
        hint: 'Leave the next person a clear state, not just a file.',
        debrief: 'A reliable finish includes what changed, where the deliverable lives, and who confirmed it.',
        choices: [
          { id: 'c_summary', label: 'Deliver it with a short change summary and approval status', consequence: 'The work and its state are both easy to verify.', nextNodeId: null, isCorrect: true, misconception: '' },
          { id: 'c_silent', label: 'Upload it with no message to avoid bothering anyone', consequence: 'The file exists, but nobody knows what changed or whether it is ready.', nextNodeId: null, isCorrect: false, misconception: 'Equating upload with completed communication' }
        ]
      }
    ]
  };
};

export const validateDrill = (drill: Drill): string[] => {
  const errors: string[] = [];
  if (!drill.title.trim()) errors.push('Add a drill title.');
  if (!drill.nodes.length) errors.push('Add at least one decision node.');
  if (!drill.nodes.some((node) => node.id === drill.startNodeId)) errors.push('Choose a valid start node.');
  const nodeIds = new Set(drill.nodes.map((node) => node.id));
  drill.nodes.forEach((node, index) => {
    const name = node.prompt.trim() || `Decision ${index + 1}`;
    if (!node.prompt.trim()) errors.push(`${name} needs a prompt.`);
    if (!node.choices.length) errors.push(`${name} needs at least one choice.`);
    node.choices.forEach((choice) => {
      if (!choice.label.trim()) errors.push(`${name} has a choice without a label.`);
      if (choice.nextNodeId && !nodeIds.has(choice.nextNodeId)) errors.push(`${name} links to a missing node.`);
    });
  });
  return errors;
};

export const shuffle = <T>(items: T[], random = Math.random): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
};

export const accuracy = (attempt: Attempt): number => {
  if (!attempt.selections.length) return 0;
  return Math.round((attempt.selections.filter((selection) => selection.correct).length / attempt.selections.length) * 100);
};

export const misconceptionCounts = (attempts: Attempt[]): Array<[string, number]> => {
  const counts = new Map<string, number>();
  attempts.flatMap((attempt) => attempt.selections).forEach((selection) => {
    if (!selection.correct && selection.misconception.trim()) {
      counts.set(selection.misconception, (counts.get(selection.misconception) ?? 0) + 1);
    }
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};

export const parseImport = (raw: string): AppData => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('That file is not valid JSON. Choose a Skill Decision Drills backup.');
  }
  return validateAppData(parsed, 'backup');
};
