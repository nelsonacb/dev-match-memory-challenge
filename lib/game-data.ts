import { Technology, GameConfig, Difficulty, GameMode } from '@/interfaces';

export const technologiesEasy: Technology[] = [
  { id: 'react', name: 'React', icon: '/technologies/reactjs.svg' },
  { id: 'angular', name: 'Angular.js', icon: '/technologies/angularjs.svg' },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '/technologies/typescript.svg',
  },
  { id: 'tailwind', name: 'Tailwind', icon: '/technologies/tailwind.svg' },
  { id: 'nodejs', name: 'Node.js', icon: '/technologies/nodejs.svg' },
  { id: 'python', name: 'Python', icon: '/technologies/python.svg' },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: '/technologies/postgresql.svg',
  },
  { id: 'git', name: 'Git', icon: '/technologies/git.svg' },
];

export const technologiesHard: Technology[] = [
  ...technologiesEasy,
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '/technologies/javascript.svg',
  },
  { id: 'graphql', name: 'GraphQL', icon: '/technologies/graphql.svg' },
  { id: 'docker', name: 'Docker', icon: '/technologies/docker.svg' },
  { id: 'flutter', name: 'Flutter', icon: '/technologies/flutter.svg' },
  { id: 'vue', name: 'Vue.js', icon: '/technologies/vuejs.svg' },
  { id: 'java', name: 'Java', icon: '/technologies/java.svg' },
  { id: 'mongodb', name: 'MongoDB', icon: '/technologies/mongodb.svg' },
  { id: 'redux', name: 'Redux', icon: '/technologies/redux.svg' },
];

export function getTechnologies(difficulty: Difficulty): Technology[] {
  return difficulty === 'easy' ? technologiesEasy : technologiesHard;
}

export const gameConfigs: Record<Difficulty, GameConfig> = {
  easy: {
    difficulty: 'easy',
    mode: 'normal',
    totalPairs: 8,
    gridCols: 4,
  },
  hard: {
    difficulty: 'hard',
    mode: 'normal',
    totalPairs: 16,
    gridCols: 8,
  },
};

export const TIME_ATTACK_DURATION = 60;

export const SCORE_CONFIG = {
  matchPoints: 100,
  errorPenalty: 10,
  comboMultiplierBase: 1,
  maxComboMultiplier: 5,
  timePenaltySeconds: 2,
  powerUpMatchesRequired: 3,
  powerUpRevealDuration: 1000,
};

export const FLIP_DELAY = 800;
export const SHUFFLE_ANIMATION_DURATION = 600;

export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to DevMatch!',
    description:
      'A memory game for developers. Match pairs of tech stack cards to win!',
    position: 'center' as const,
  },
  {
    id: 'cards',
    title: 'Flip the Cards',
    description:
      'Click on any card to flip it and reveal the technology icon underneath.',
    targetSelector: '[data-tutorial="card"]',
    position: 'bottom' as const,
  },
  {
    id: 'match',
    title: 'Find Matching Pairs',
    description:
      'Flip two cards. If they match, they stay revealed. If not, they flip back.',
    position: 'center' as const,
  },
  {
    id: 'combo',
    title: 'Build Combos!',
    description:
      'Match consecutive pairs without errors to multiply your score up to 5x!',
    targetSelector: '[data-tutorial="score"]',
    position: 'bottom' as const,
  },
  {
    id: 'powerup',
    title: 'Power-Ups',
    description:
      'Every 3 consecutive matches unlocks a power-up that reveals a random pair!',
    position: 'center' as const,
  },
  {
    id: 'shuffle',
    title: 'Shuffle Option',
    description:
      'Stuck? Use the shuffle button once per game to rearrange remaining cards.',
    targetSelector: '[data-tutorial="shuffle"]',
    position: 'top' as const,
  },
];
