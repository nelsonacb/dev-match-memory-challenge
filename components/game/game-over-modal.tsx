'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { XCircle, Clock, Target, Star, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTime } from '@/lib/game-utils';
import { SaveGamePayload, Difficulty, GameMode } from '@/interfaces';

interface GameOverModalProps {
  isOpen: boolean;
  timeSeconds: number;
  attempts: number;
  score: number;
  maxStreak: number;
  difficulty: Difficulty;
  mode: GameMode;
  onClose: () => void;
  onPlayAgain: () => void;
  onSaveGame: (data: SaveGamePayload) => Promise<void>;
}

export function GameOverModal({
  isOpen,
  timeSeconds,
  attempts,
  score,
  maxStreak,
  difficulty,
  mode,
  onClose,
  onPlayAgain,
  onSaveGame,
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      );
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (hasSaved) return;

    setIsSaving(true);
    try {
      await onSaveGame({
        playerName: playerName.trim() || 'Anonymous',
        timeSeconds,
        attempts,
        score,
        maxStreak,
        difficulty,
        mode,
        won: false,
      });
      setHasSaved(true);
    } catch (error) {
      console.error('Failed to save game:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlayAgain = () => {
    setPlayerName('');
    setHasSaved(false);
    onPlayAgain();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'
        >
          <div
            ref={modalRef}
            className='relative w-full max-w-md bg-linear-to-b from-slate-800 to-slate-900 rounded-2xl border border-red-900/50 shadow-2xl overflow-hidden'
          >
            <div className='pt-8 pb-4 px-6 text-center'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-red-500 to-red-700 mb-4 shadow-lg shadow-red-500/30'
              >
                <XCircle className='w-10 h-10 text-white' />
              </motion.div>
              <h2 className='text-2xl font-bold text-white mb-2'>
                Time&apos;s Up!
              </h2>
              <p className='text-slate-400'>
                You ran out of time in Time Attack mode
              </p>
            </div>

            <div className='px-6 py-4 grid grid-cols-2 gap-4'>
              <div className='text-center p-3 rounded-xl bg-slate-900/50'>
                <div className='flex items-center justify-center gap-2 text-blue-400 mb-1'>
                  <Clock className='w-4 h-4' />
                  <span className='text-lg font-bold'>
                    {formatTime(timeSeconds)}
                  </span>
                </div>
                <span className='text-xs text-slate-400'>Time Played</span>
              </div>
              <div className='text-center p-3 rounded-xl bg-slate-900/50'>
                <div className='flex items-center justify-center gap-2 text-amber-400 mb-1'>
                  <Star className='w-4 h-4' />
                  <span className='text-lg font-bold'>{score}</span>
                </div>
                <span className='text-xs text-slate-400'>Score</span>
              </div>
              <div className='text-center p-3 rounded-xl bg-slate-900/50'>
                <div className='flex items-center justify-center gap-2 text-emerald-400 mb-1'>
                  <Target className='w-4 h-4' />
                  <span className='text-lg font-bold'>{attempts}</span>
                </div>
                <span className='text-xs text-slate-400'>Attempts</span>
              </div>
              <div className='text-center p-3 rounded-xl bg-slate-900/50'>
                <div className='flex items-center justify-center gap-2 text-purple-400 mb-1'>
                  <Trophy className='w-4 h-4' />
                  <span className='text-lg font-bold'>{maxStreak}</span>
                </div>
                <span className='text-xs text-slate-400'>Best Streak</span>
              </div>
            </div>

            <div className='px-6 py-4'>
              <label className='block text-sm text-slate-400 mb-2'>
                Save your attempt to the leaderboard
              </label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder='Anonymous'
                disabled={hasSaved}
                className='bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500'
              />
            </div>

            <div className='px-6 pb-6 flex gap-3'>
              <Button
                onClick={handleSave}
                disabled={isSaving || hasSaved}
                variant='outline'
                className='flex-1 bg-slate-900/50 border-slate-600 hover:bg-slate-800 text-white'
              >
                {hasSaved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Score'}
              </Button>
              <Button
                onClick={handlePlayAgain}
                className='flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0'
              >
                <RotateCcw className='w-4 h-4 mr-2' />
                Try Again
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
