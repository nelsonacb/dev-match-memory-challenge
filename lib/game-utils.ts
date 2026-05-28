import { Card, Difficulty, GameConfig } from '@/interfaces';
import { getTechnologies, gameConfigs, SCORE_CONFIG } from './game-data';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createCards(difficulty: Difficulty = 'easy'): Card[] {
  const technologies = getTechnologies(difficulty);
  const cards: Card[] = [];

  technologies.forEach((tech, index) => {
    cards.push({
      id: index * 2,
      technologyId: tech.id,
      name: tech.name,
      icon: tech.icon,
      isFlipped: false,
      isMatched: false,
      isRevealed: false,
    });
    cards.push({
      id: index * 2 + 1,
      technologyId: tech.id,
      name: tech.name,
      icon: tech.icon,
      isFlipped: false,
      isMatched: false,
      isRevealed: false,
    });
  });

  return shuffleArray(cards);
}

export function shuffleUnmatchedCards(cards: Card[]): Card[] {
  const matchedCards = cards.filter((c) => c.isMatched);
  const unmatchedCards = cards.filter((c) => !c.isMatched);
  const shuffledUnmatched = shuffleArray(unmatchedCards);

  const result: Card[] = [];
  let unmatchedIndex = 0;

  cards.forEach((card) => {
    if (card.isMatched) {
      result.push(card);
    } else {
      result.push({
        ...shuffledUnmatched[unmatchedIndex],
        id: card.id,
      });
      unmatchedIndex++;
    }
  });

  return result;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function checkMatch(card1: Card, card2: Card): boolean {
  return card1.technologyId === card2.technologyId;
}

export function calculateScore(
  basePoints: number,
  combo: number,
  isMatch: boolean,
): number {
  if (!isMatch) {
    return -SCORE_CONFIG.errorPenalty;
  }

  const multiplier = Math.min(combo + 1, SCORE_CONFIG.maxComboMultiplier);
  return basePoints * multiplier;
}

export function getGameConfig(difficulty: Difficulty): GameConfig {
  return gameConfigs[difficulty];
}

export function getGridClass(difficulty: Difficulty): string {
  return difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-8';
}

export function findRandomUnmatchedPair(cards: Card[]): [Card, Card] | null {
  const unmatchedTechIds = new Set<string>();

  cards.forEach((card) => {
    if (!card.isMatched && !card.isFlipped) {
      unmatchedTechIds.add(card.technologyId);
    }
  });

  const techIdsArray = Array.from(unmatchedTechIds);
  if (techIdsArray.length === 0) return null;

  const randomTechId =
    techIdsArray[Math.floor(Math.random() * techIdsArray.length)];
  const pair = cards.filter(
    (c) => c.technologyId === randomTechId && !c.isMatched && !c.isFlipped,
  );

  if (pair.length >= 2) {
    return [pair[0], pair[1]];
  }

  return null;
}

export const TUTORIAL_SEEN_KEY = 'devmatch_tutorial_seen';

export function hasTutorialBeenSeen(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(TUTORIAL_SEEN_KEY) === 'true';
}

export function markTutorialAsSeen(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
}

export function resetTutorial(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TUTORIAL_SEEN_KEY);
}
