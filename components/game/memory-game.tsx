'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGameLogic } from '@/hooks/use-game-logic';
import { useSound } from '@/hooks/use-sound';
import { GameHeader } from './game-header';
import { GameBoard } from './game-board';
import { GameStats } from './game-stats';
import { GameSettings } from './game-settings';
import { VictoryModal } from './victory-modal';
import { LeaderboardModal } from './leaderboard-modal';
import { GameOverModal } from './game-over-modal';
import { TutorialOverlay } from './tutorial-overlay';
import { SaveGamePayload, GameEvent } from '@/interfaces';

const Background3D = dynamic(
  () =>
    import('./background-3d').then((mod) => ({ default: mod.Background3D })),
  { ssr: false },
);

export function MemoryGame() {
  const {
    cards,
    matchedPairs,
    attempts,
    timeSeconds,
    pairsRemaining,
    totalPairs,
    isGameStarted,
    isGameComplete,
    isGameOver,
    score,
    combo,
    maxCombo,
    powerUpAvailable,
    shufflesRemaining,
    difficulty,
    mode,
    isChecking,
    lastEvent,
    flipCard,
    resetGame,
    shuffleCards,
    usePowerUp,
    setDifficulty,
    setMode,
  } = useGameLogic();

  const { play, setEnabled } = useSound();
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [newRecordId, setNewRecordId] = useState<number | undefined>();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case 'match':
        play('match');
        break;
      case 'error':
        play('error');
        break;
      case 'combo':
        play('combo');
        break;
      case 'victory':
        play('victory');
        break;
      case 'gameOver':
        play('gameOver');
        break;
      case 'powerUp':
        play('powerUp');
        break;
    }
  }, [lastEvent, play]);

  useEffect(() => {
    if (isGameComplete && !showVictoryModal) {
      setTimeout(() => setShowVictoryModal(true), 500);
    }
  }, [isGameComplete, showVictoryModal]);

  useEffect(() => {
    if (isGameOver && !showGameOver) {
      setTimeout(() => setShowGameOver(true), 500);
    }
  }, [isGameOver, showGameOver]);

  const handleSaveGame = async (data: SaveGamePayload) => {
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.id) {
        setNewRecordId(result.id);
      }
    } catch (error) {
      console.error('Failed to save game:', error);
      throw error;
    }
  };

  const handlePlayAgain = () => {
    setShowVictoryModal(false);
    setShowGameOver(false);
    setNewRecordId(undefined);
    resetGame();
  };

  const handleCloseVictory = () => {
    setShowVictoryModal(false);
  };

  const handleCloseGameOver = () => {
    setShowGameOver(false);
  };

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    play('flip');
    shuffleCards();
    setTimeout(() => setIsShuffling(false), 600);
  }, [shuffleCards, play]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      play('flip');
      flipCard(cardId);
    },
    [flipCard, play],
  );

  const handleToggleSound = useCallback(() => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    setEnabled(newEnabled);
  }, [soundEnabled, setEnabled]);

  const handleTutorialComplete = useCallback(() => {}, []);

  return (
    <div className='min-h-screen relative overflow-hidden'>
      <Background3D lastEvent={lastEvent} />

      <div className='relative z-10 container mx-auto px-4 py-4 min-h-screen flex flex-col'>
        <GameHeader />

        <div className='flex-1 flex flex-col justify-center'>
          <GameSettings
            difficulty={difficulty}
            mode={mode}
            onDifficultyChange={setDifficulty}
            onModeChange={setMode}
            isGameStarted={isGameStarted}
          />

          <GameStats
            timeSeconds={timeSeconds}
            attempts={attempts}
            pairsRemaining={pairsRemaining}
            matchedPairs={matchedPairs}
            totalPairs={totalPairs}
            score={score}
            combo={combo}
            powerUpAvailable={powerUpAvailable}
            shufflesRemaining={shufflesRemaining}
            mode={mode}
            difficulty={difficulty}
            soundEnabled={soundEnabled}
            onReset={() => resetGame()}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onUsePowerUp={usePowerUp}
            onShuffle={handleShuffle}
            onToggleSound={handleToggleSound}
          />

          <GameBoard
            cards={cards}
            onCardClick={handleCardClick}
            isChecking={isChecking}
            difficulty={difficulty}
            isShuffling={isShuffling}
          />
        </div>

        <footer className='text-center py-4 text-slate-500 text-xs'>
          Built with Next.js, TypeScript, Tailwind CSS, GSAP, Framer Motion &
          Three.js
        </footer>
      </div>

      <TutorialOverlay onComplete={handleTutorialComplete} />

      <VictoryModal
        isOpen={showVictoryModal}
        timeSeconds={timeSeconds}
        attempts={attempts}
        score={score}
        maxStreak={maxCombo}
        difficulty={difficulty}
        mode={mode}
        onClose={handleCloseVictory}
        onPlayAgain={handlePlayAgain}
        onSaveGame={handleSaveGame}
      />

      <GameOverModal
        isOpen={showGameOver}
        timeSeconds={timeSeconds}
        attempts={attempts}
        score={score}
        maxStreak={maxCombo}
        difficulty={difficulty}
        mode={mode}
        onClose={handleCloseGameOver}
        onPlayAgain={handlePlayAgain}
        onSaveGame={handleSaveGame}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        newRecordId={newRecordId}
      />
    </div>
  );
}
