'use client';

import { motion } from 'framer-motion';
import { Card, Difficulty } from '@/interfaces';
import { GameCard } from './game-card';
import { getGridClass } from '@/lib/game-utils';

interface GameBoardProps {
  cards: Card[];
  onCardClick: (cardId: number) => void;
  isChecking: boolean;
  difficulty: Difficulty;
  isShuffling?: boolean;
}

export function GameBoard({
  cards,
  onCardClick,
  isChecking,
  difficulty,
  isShuffling,
}: GameBoardProps) {
  const gridClass = getGridClass(difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full mx-auto ${difficulty === 'hard' ? 'max-w-4xl' : 'max-w-lg'}`}
    >
      <div className={`grid ${gridClass} gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-4`}>
        {cards.map((card, index) => (
          <GameCard
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
            isChecking={isChecking}
            index={index}
            isShuffling={isShuffling}
          />
        ))}
      </div>
    </motion.div>
  );
}
