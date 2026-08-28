export type Choice = {
  id: string;
  label: string;
  consequence: string;
  nextNodeId: string | null;
  isCorrect: boolean;
  misconception: string;
};

export type DrillNode = {
  id: string;
  prompt: string;
  image?: string;
  hint: string;
  debrief: string;
  choices: Choice[];
};

export type Drill = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  startNodeId: string;
  shuffleChoices: boolean;
  nodes: DrillNode[];
};

export type Selection = {
  nodeId: string;
  choiceId: string;
  correct: boolean;
  misconception: string;
};

export type Attempt = {
  id: string;
  drillId: string;
  startedAt: string;
  completedAt: string;
  selections: Selection[];
};

export type AppData = {
  drills: Drill[];
  attempts: Attempt[];
};

export type LicenseState = {
  unlocked: boolean;
  checking: boolean;
  notice: string;
};
