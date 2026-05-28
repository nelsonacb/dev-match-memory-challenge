export type Difficulty = 'easy' | 'hard';
export type GameMode = 'normal' | 'timeAttack';

export interface Card {
  id: number;
  technologyId: string;
  name: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  isRevealed?: boolean;
}

export interface CardPair {
  first: Card | null;
  second: Card | null;
}

export interface GameConfig {
  difficulty: Difficulty;
  mode: GameMode;
  totalPairs: number;
  gridCols: number;
  timeLimit?: number;
}

export interface GameState {
  cards: Card[];
  flippedCards: CardPair;
  matchedPairs: number;
  attempts: number;
  timeSeconds: number;
  isGameStarted: boolean;
  isGameComplete: boolean;
  isGameOver: boolean;
  score: number;
  combo: number;
  maxCombo: number;
  consecutiveMatches: number;
  shufflesRemaining: number;
  powerUpAvailable: boolean;
  difficulty: Difficulty;
  mode: GameMode;
}

export interface ScoreEvent {
  type: 'match' | 'error' | 'combo' | 'timeBonus';
  points: number;
  multiplier?: number;
}

export interface GameRecord {
  id: number;
  playerName: string;
  timeSeconds: number;
  attempts: number;
  score: number;
  maxStreak: number;
  difficulty: string;
  mode: string;
  won: boolean;
  createdAt: string;
}

export interface LeaderboardEntry extends GameRecord {
  rank: number;
  isNewRecord?: boolean;
}

export interface LeaderboardFilter {
  difficulty?: Difficulty;
  mode?: GameMode;
  sortBy: 'time' | 'score' | 'streak';
}

export interface SaveGamePayload {
  playerName: string;
  timeSeconds: number;
  attempts: number;
  score: number;
  maxStreak: number;
  difficulty: Difficulty;
  mode: GameMode;
  won: boolean;
}

export interface GameStats {
  totalGames: number;
  avgTime: number;
  avgAttempts: number;
  bestTime: number;
  bestScore: number;
  bestStreak: number;
}

export interface Technology {
  id: string;
  name: string;
  icon: string;
}

export interface CardAnimationState {
  isFlipping: boolean;
  isShaking: boolean;
  isGlowing: boolean;
}

export interface ModalState {
  isOpen: boolean;
  type: 'victory' | 'leaderboard' | 'gameOver' | 'settings' | null;
}

export interface GameEvent {
  type: 'match' | 'error' | 'combo' | 'victory' | 'gameOver' | 'powerUp';
  timestamp: number;
}

export type SoundType =
  | 'flip'
  | 'match'
  | 'error'
  | 'victory'
  | 'gameOver'
  | 'combo'
  | 'powerUp'
  | 'tick';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}
