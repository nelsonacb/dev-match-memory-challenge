'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CardPair,
  GameState,
  Difficulty,
  GameMode,
  GameEvent,
} from '@/interfaces';
import {
  createCards,
  checkMatch,
  shuffleUnmatchedCards,
  findRandomUnmatchedPair,
  calculateScore,
} from '@/lib/game-utils';
import {
  FLIP_DELAY,
  SCORE_CONFIG,
  TIME_ATTACK_DURATION,
  gameConfigs,
} from '@/lib/game-data';

const createInitialState = (
  difficulty: Difficulty,
  mode: GameMode,
): GameState => ({
  cards: [],
  flippedCards: { first: null, second: null },
  matchedPairs: 0,
  attempts: 0,
  timeSeconds: mode === 'timeAttack' ? TIME_ATTACK_DURATION : 0,
  isGameStarted: false,
  isGameComplete: false,
  isGameOver: false,
  score: 0,
  combo: 0,
  maxCombo: 0,
  consecutiveMatches: 0,
  shufflesRemaining: 1,
  powerUpAvailable: false,
  difficulty,
  mode,
});

interface UseGameLogicReturn extends GameState {
  pairsRemaining: number;
  totalPairs: number;
  isChecking: boolean;
  lastEvent: GameEvent | null;
  flipCard: (cardId: number) => void;
  resetGame: (difficulty?: Difficulty, mode?: GameMode) => void;
  shuffleCards: () => void;
  usePowerUp: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setMode: (mode: GameMode) => void;
}

export function useGameLogic(
  initialDifficulty: Difficulty = 'easy',
  initialMode: GameMode = 'normal',
): UseGameLogicReturn {
  const [gameState, setGameState] = useState<GameState>(
    createInitialState(initialDifficulty, initialMode),
  );
  const [isChecking, setIsChecking] = useState(false);
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPairs = gameConfigs[gameState.difficulty].totalPairs;

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      cards: createCards(prev.difficulty),
    }));
  }, []);

  useEffect(() => {
    if (
      gameState.isGameStarted &&
      !gameState.isGameComplete &&
      !gameState.isGameOver
    ) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          const newTime =
            prev.mode === 'timeAttack'
              ? prev.timeSeconds - 1
              : prev.timeSeconds + 1;

          if (prev.mode === 'timeAttack' && newTime <= 0) {
            setLastEvent({ type: 'gameOver', timestamp: Date.now() });
            return {
              ...prev,
              timeSeconds: 0,
              isGameOver: true,
            };
          }

          return { ...prev, timeSeconds: newTime };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isGameStarted, gameState.isGameComplete, gameState.isGameOver]);

  const emitEvent = useCallback((type: GameEvent['type']) => {
    setLastEvent({ type, timestamp: Date.now() });
  }, []);

  const flipCard = useCallback(
    (cardId: number) => {
      if (isChecking || gameState.isGameOver || gameState.isGameComplete)
        return;

      setGameState((prev) => {
        const card = prev.cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return prev;

        const isGameStarted = prev.isGameStarted || true;
        const updatedCards = prev.cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c,
        );

        let newFlippedCards: CardPair;
        if (!prev.flippedCards.first) {
          newFlippedCards = {
            first: { ...card, isFlipped: true },
            second: null,
          };
        } else {
          newFlippedCards = {
            first: prev.flippedCards.first,
            second: { ...card, isFlipped: true },
          };
        }

        return {
          ...prev,
          cards: updatedCards,
          flippedCards: newFlippedCards,
          isGameStarted,
        };
      });
    },
    [isChecking, gameState.isGameOver, gameState.isGameComplete],
  );

  useEffect(() => {
    const { first, second } = gameState.flippedCards;
    if (!first || !second) return;

    setIsChecking(true);
    const isMatch = checkMatch(first, second);

    const timeout = setTimeout(() => {
      setGameState((prev) => {
        const newAttempts = prev.attempts + 1;

        if (isMatch) {
          const newCombo = prev.combo + 1;
          const newMaxCombo = Math.max(prev.maxCombo, newCombo);
          const scoreGain = calculateScore(
            SCORE_CONFIG.matchPoints,
            prev.combo,
            true,
          );
          const newConsecutiveMatches = prev.consecutiveMatches + 1;
          const powerUpAvailable =
            newConsecutiveMatches >= SCORE_CONFIG.powerUpMatchesRequired;

          emitEvent(newCombo > 1 ? 'combo' : 'match');

          const updatedCards = prev.cards.map((c) =>
            c.technologyId === first.technologyId
              ? { ...c, isMatched: true, isRevealed: false }
              : c,
          );

          const newMatchedPairs = prev.matchedPairs + 1;
          const isComplete = newMatchedPairs === totalPairs;

          if (isComplete) {
            emitEvent('victory');
          }

          return {
            ...prev,
            cards: updatedCards,
            flippedCards: { first: null, second: null },
            matchedPairs: newMatchedPairs,
            attempts: newAttempts,
            isGameComplete: isComplete,
            score: prev.score + scoreGain,
            combo: newCombo,
            maxCombo: newMaxCombo,
            consecutiveMatches: newConsecutiveMatches,
            powerUpAvailable: powerUpAvailable && !isComplete,
          };
        } else {
          emitEvent('error');

          const timePenalty =
            prev.mode === 'normal' ? SCORE_CONFIG.timePenaltySeconds : 0;
          const scorePenalty = calculateScore(0, 0, false);

          const updatedCards = prev.cards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isFlipped: false }
              : c,
          );

          return {
            ...prev,
            cards: updatedCards,
            flippedCards: { first: null, second: null },
            attempts: newAttempts,
            timeSeconds: prev.timeSeconds + timePenalty,
            score: Math.max(0, prev.score + scorePenalty),
            combo: 0,
            consecutiveMatches: 0,
            powerUpAvailable: false,
          };
        }
      });
      setIsChecking(false);
    }, FLIP_DELAY);

    return () => clearTimeout(timeout);
  }, [gameState.flippedCards, totalPairs, emitEvent]);

  const resetGame = useCallback(
    (
      difficulty: Difficulty = gameState.difficulty,
      mode: GameMode = gameState.mode,
    ) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState({
        ...createInitialState(difficulty, mode),
        cards: createCards(difficulty),
      });
      setIsChecking(false);
      setLastEvent(null);
    },
    [gameState.difficulty, gameState.mode],
  );

  const shuffleCards = useCallback(() => {
    if (gameState.shufflesRemaining <= 0 || gameState.isGameComplete) return;

    setGameState((prev) => ({
      ...prev,
      cards: shuffleUnmatchedCards(prev.cards),
      shufflesRemaining: prev.shufflesRemaining - 1,
    }));
  }, [gameState.shufflesRemaining, gameState.isGameComplete]);

  const usePowerUp = useCallback(() => {
    if (!gameState.powerUpAvailable || gameState.isGameComplete) return;

    const pair = findRandomUnmatchedPair(gameState.cards);
    if (!pair) return;

    emitEvent('powerUp');

    setGameState((prev) => ({
      ...prev,
      cards: prev.cards.map((c) =>
        c.id === pair[0].id || c.id === pair[1].id
          ? { ...c, isRevealed: true }
          : c,
      ),
      powerUpAvailable: false,
      consecutiveMatches: 0,
    }));

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => ({ ...c, isRevealed: false })),
      }));
    }, SCORE_CONFIG.powerUpRevealDuration);
  }, [
    gameState.powerUpAvailable,
    gameState.isGameComplete,
    gameState.cards,
    emitEvent,
  ]);

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      resetGame(difficulty, gameState.mode);
    },
    [resetGame, gameState.mode],
  );

  const setMode = useCallback(
    (mode: GameMode) => {
      resetGame(gameState.difficulty, mode);
    },
    [resetGame, gameState.difficulty],
  );

  const pairsRemaining = totalPairs - gameState.matchedPairs;

  return {
    ...gameState,
    pairsRemaining,
    totalPairs,
    isChecking,
    lastEvent,
    flipCard,
    resetGame,
    shuffleCards,
    usePowerUp,
    setDifficulty,
    setMode,
  };
}
