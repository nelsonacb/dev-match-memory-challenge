'use client';

import { motion } from 'framer-motion';
import { Zap, Brain, Timer, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Difficulty, GameMode } from '@/interfaces';

interface GameSettingsProps {
  difficulty: Difficulty;
  mode: GameMode;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: GameMode) => void;
  isGameStarted: boolean;
}

export function GameSettings({
  difficulty,
  mode,
  onDifficultyChange,
  onModeChange,
  isGameStarted,
}: GameSettingsProps) {
  const difficulties: {
    value: Difficulty;
    label: string;
    icon: typeof Brain;
    description: string;
  }[] = [
    {
      value: 'easy',
      label: 'Easy',
      icon: Brain,
      description: '4x4 Grid (8 pairs)',
    },
    {
      value: 'hard',
      label: 'Hard',
      icon: Zap,
      description: '8x4 Grid (16 pairs)',
    },
  ];

  const modes: {
    value: GameMode;
    label: string;
    icon: typeof Timer;
    description: string;
  }[] = [
    {
      value: 'normal',
      label: 'Normal',
      icon: Gamepad2,
      description: 'No time limit',
    },
    {
      value: 'timeAttack',
      label: 'Time Attack',
      icon: Timer,
      description: '60 seconds',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full max-w-lg mx-auto mb-4'
    >
      <div className='bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-3'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='flex-1'>
            <span className='text-xs text-slate-400 uppercase tracking-wide mb-2 block'>
              Difficulty
            </span>
            <div className='flex gap-2'>
              {difficulties.map((d) => (
                <Button
                  key={d.value}
                  onClick={() => onDifficultyChange(d.value)}
                  disabled={isGameStarted}
                  variant={difficulty === d.value ? 'default' : 'outline'}
                  size='sm'
                  className={`flex-1 ${
                    difficulty === d.value
                      ? 'bg-linear-to-r from-indigo-600 to-purple-600 border-0 text-white'
                      : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-800'
                  } ${isGameStarted ? 'opacity-50' : ''}`}
                  title={d.description}
                >
                  <d.icon className='w-4 h-4 mr-1' />
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex-1'>
            <span className='text-xs text-slate-400 uppercase tracking-wide mb-2 block'>
              Mode
            </span>
            <div className='flex gap-2'>
              {modes.map((m) => (
                <Button
                  key={m.value}
                  onClick={() => onModeChange(m.value)}
                  disabled={isGameStarted}
                  variant={mode === m.value ? 'default' : 'outline'}
                  size='sm'
                  className={`flex-1 ${
                    mode === m.value
                      ? m.value === 'timeAttack'
                        ? 'bg-linear-to-r from-red-600 to-orange-600 border-0 text-white'
                        : 'bg-linear-to-r from-indigo-600 to-purple-600 border-0 text-white'
                      : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-800'
                  } ${isGameStarted ? 'opacity-50' : ''}`}
                  title={m.description}
                >
                  <m.icon className='w-4 h-4 mr-1' />
                  {m.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isGameStarted && (
          <p className='text-xs text-slate-500 mt-2 text-center'>
            Start a new game to change settings
          </p>
        )}
      </div>
    </motion.div>
  );
}
