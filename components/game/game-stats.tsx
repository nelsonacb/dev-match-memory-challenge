'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Clock,
  Target,
  Layers,
  Star,
  Zap,
  Shuffle,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { formatTime } from '@/lib/game-utils';
import { Button } from '@/components/ui/button';
import { Difficulty, GameMode } from '@/interfaces';

interface GameStatsProps {
  timeSeconds: number;
  attempts: number;
  pairsRemaining: number;
  matchedPairs: number;
  totalPairs: number;
  score: number;
  combo: number;
  powerUpAvailable: boolean;
  shufflesRemaining: number;
  mode: GameMode;
  difficulty: Difficulty;
  soundEnabled: boolean;
  onReset: () => void;
  onShowLeaderboard: () => void;
  onUsePowerUp: () => void;
  onShuffle: () => void;
  onToggleSound: () => void;
}

export function GameStats({
  timeSeconds,
  attempts,
  pairsRemaining,
  matchedPairs,
  totalPairs,
  score,
  combo,
  powerUpAvailable,
  shufflesRemaining,
  mode,
  soundEnabled,
  onReset,
  onShowLeaderboard,
  onUsePowerUp,
  onShuffle,
  onToggleSound,
}: GameStatsProps) {
  const comboRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const prevCombo = useRef(combo);
  const prevScore = useRef(score);

  useEffect(() => {
    if (combo > prevCombo.current && comboRef.current) {
      gsap.fromTo(
        comboRef.current,
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
      );
    }
    prevCombo.current = combo;
  }, [combo]);

  useEffect(() => {
    if (score !== prevScore.current && scoreRef.current) {
      gsap.fromTo(
        scoreRef.current,
        { scale: 1.2 },
        { scale: 1, duration: 0.2 },
      );
    }
    prevScore.current = score;
  }, [score]);

  useEffect(() => {
    if (
      mode === 'timeAttack' &&
      timeSeconds <= 10 &&
      timeSeconds > 0 &&
      timerRef.current
    ) {
      gsap.to(timerRef.current, {
        color: '#ef4444',
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
  }, [timeSeconds, mode]);

  const isTimeAttack = mode === 'timeAttack';
  const timeWarning = isTimeAttack && timeSeconds <= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='w-full max-w-lg mx-auto mb-4'
    >
      <div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4'>
        <div className='flex items-center justify-between gap-2 mb-3'>
          <div className='flex-1 flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/50'>
            <Clock
              className={`w-5 h-5 ${timeWarning ? 'text-red-400' : 'text-blue-400'}`}
            />
            <span className='text-xs text-slate-400'>Time</span>
            <span
              ref={timerRef}
              className={`text-lg font-bold font-mono ${timeWarning ? 'text-red-400' : 'text-blue-400'}`}
            >
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div
            className='flex-1 flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/50'
            data-tutorial='score'
          >
            <Star className='w-5 h-5 text-amber-400' />
            <span className='text-xs text-slate-400'>Score</span>
            <span
              ref={scoreRef}
              className='text-lg font-bold text-amber-400'
            >
              {score}
            </span>
          </div>

          <div className='flex-1 flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/50 relative overflow-hidden'>
            <Zap className='w-5 h-5 text-purple-400' />
            <span className='text-xs text-slate-400'>Combo</span>
            <AnimatePresence mode='wait'>
              {combo > 0 ? (
                <motion.div
                  ref={comboRef}
                  key={combo}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className='text-lg font-bold text-purple-400'
                >
                  x{Math.min(combo + 1, 5)}
                </motion.div>
              ) : (
                <span className='text-lg font-bold text-slate-500'>x1</span>
              )}
            </AnimatePresence>
          </div>

          <div className='flex-1 flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/50'>
            <Target className='w-5 h-5 text-emerald-400' />
            <span className='text-xs text-slate-400'>Tries</span>
            <span className='text-lg font-bold text-emerald-400'>
              {attempts}
            </span>
          </div>
        </div>

        <div className='mb-3'>
          <div className='flex justify-between text-xs text-slate-400 mb-1'>
            <span className='flex items-center gap-1'>
              <Layers className='w-3 h-3' /> Progress
            </span>
            <span>
              {matchedPairs}/{totalPairs} pairs
            </span>
          </div>
          <div className='h-2 bg-slate-900 rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-linear-to-r from-indigo-500 to-purple-500'
              initial={{ width: 0 }}
              animate={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {isTimeAttack && (
          <div className='mb-3'>
            <div className='h-1.5 bg-slate-900 rounded-full overflow-hidden'>
              <motion.div
                className={`h-full ${timeWarning ? 'bg-red-500' : 'bg-orange-500'}`}
                animate={{ width: `${(timeSeconds / 60) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <div className='flex gap-2'>
          <Button
            onClick={onReset}
            variant='outline'
            size='sm'
            className='flex-1 bg-slate-900/50 border-slate-600 hover:bg-slate-800 text-slate-200'
          >
            <RotateCcw className='w-4 h-4 mr-1' />
            New
          </Button>

          <Button
            onClick={onShuffle}
            disabled={shufflesRemaining <= 0}
            variant='outline'
            size='sm'
            className={`flex-1 bg-slate-900/50 border-slate-600 text-slate-200 ${
              shufflesRemaining > 0 ? 'hover:bg-slate-800' : 'opacity-50'
            }`}
            data-tutorial='shuffle'
          >
            <Shuffle className='w-4 h-4 mr-1' />
            Shuffle ({shufflesRemaining})
          </Button>

          <Button
            onClick={onUsePowerUp}
            disabled={!powerUpAvailable}
            variant='outline'
            size='sm'
            className={`flex-1 ${
              powerUpAvailable
                ? 'bg-linear-to-r from-amber-600/50 to-orange-600/50 border-amber-500 text-amber-200 hover:from-amber-600 hover:to-orange-600'
                : 'bg-slate-900/50 border-slate-600 text-slate-500 opacity-50'
            }`}
          >
            <Zap className='w-4 h-4 mr-1' />
            Reveal
          </Button>

          <Button
            onClick={onShowLeaderboard}
            variant='outline'
            size='sm'
            className='bg-slate-900/50 border-slate-600 hover:bg-slate-800 text-slate-200'
          >
            <Trophy className='w-4 h-4' />
          </Button>

          <Button
            onClick={onToggleSound}
            variant='outline'
            size='sm'
            className='bg-slate-900/50 border-slate-600 hover:bg-slate-800 text-slate-200'
          >
            {soundEnabled ? (
              <Volume2 className='w-4 h-4' />
            ) : (
              <VolumeX className='w-4 h-4' />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
