'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  Trophy,
  Clock,
  Target,
  X,
  RefreshCw,
  Medal,
  Star,
  Zap,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/game-utils';
import { LeaderboardEntry, LeaderboardFilter } from '@/interfaces';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRecordId?: number;
}

export function LeaderboardModal({
  isOpen,
  onClose,
  newRecordId,
}: LeaderboardModalProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<LeaderboardFilter>({ sortBy: 'time' });
  const modalRef = useRef<HTMLDivElement>(null);
  const newRecordRef = useRef<HTMLTableRowElement>(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '10',
        sortBy: filter.sortBy,
        ...(filter.difficulty && { difficulty: filter.difficulty }),
        ...(filter.mode && { mode: filter.mode }),
      });

      const res = await fetch(`/api/games?${params}`);
      const data = await res.json();
      const ranked = data.map((entry: LeaderboardEntry, index: number) => ({
        ...entry,
        rank: index + 1,
        isNewRecord: entry.id === newRecordId,
      }));
      setEntries(ranked);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();

      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
        );
      }
    }
  }, [isOpen, filter]);

  useEffect(() => {
    if (newRecordRef.current && newRecordId) {
      gsap.to(newRecordRef.current, {
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        duration: 0.5,
        repeat: 3,
        yoyo: true,
      });
    }
  }, [entries, newRecordId]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-amber-400';
      case 2:
        return 'text-slate-300';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-slate-500';
    }
  };

  const sortOptions: {
    value: LeaderboardFilter['sortBy'];
    label: string;
    icon: typeof Clock;
  }[] = [
    { value: 'time', label: 'Time', icon: Clock },
    { value: 'score', label: 'Score', icon: Star },
    { value: 'streak', label: 'Streak', icon: Zap },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
          onClick={onClose}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className='relative w-full max-w-lg bg-linear-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden'
          >
            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10'
            >
              <X className='w-5 h-5' />
            </button>

            <div className='pt-6 pb-4 px-6 text-center border-b border-slate-700'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 mb-3 shadow-lg shadow-amber-500/30'>
                <Trophy className='w-7 h-7 text-amber-900' />
              </div>
              <h2 className='text-xl font-bold text-white'>Leaderboard</h2>
              <p className='text-sm text-slate-400'>Top 10 Players</p>
            </div>

            <div className='px-4 py-3 border-b border-slate-700/50'>
              <div className='flex items-center gap-2'>
                <Filter className='w-4 h-4 text-slate-400' />
                <span className='text-xs text-slate-400 mr-2'>Sort by:</span>
                <div className='flex gap-1'>
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() =>
                        setFilter((prev) => ({ ...prev, sortBy: option.value }))
                      }
                      variant={
                        filter.sortBy === option.value ? 'default' : 'outline'
                      }
                      size='sm'
                      className={`text-xs h-7 ${
                        filter.sortBy === option.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900/50 border-slate-600 text-slate-300'
                      }`}
                    >
                      <option.icon className='w-3 h-3 mr-1' />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className='px-4 py-4 max-h-80 overflow-y-auto'>
              {isLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <RefreshCw className='w-6 h-6 text-indigo-400 animate-spin' />
                </div>
              ) : entries.length === 0 ? (
                <div className='text-center py-8 text-slate-400'>
                  No games recorded yet. Be the first!
                </div>
              ) : (
                <table className='w-full'>
                  <thead>
                    <tr className='text-xs text-slate-400 uppercase'>
                      <th className='py-2 px-2 text-left'>#</th>
                      <th className='py-2 px-2 text-left'>Player</th>
                      <th className='py-2 px-2 text-center'>
                        <Clock className='w-3 h-3 inline' />
                      </th>
                      <th className='py-2 px-2 text-center'>
                        <Star className='w-3 h-3 inline' />
                      </th>
                      <th className='py-2 px-2 text-center'>
                        <Zap className='w-3 h-3 inline' />
                      </th>
                      <th className='py-2 px-2 text-center'>
                        <Target className='w-3 h-3 inline' />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        ref={entry.isNewRecord ? newRecordRef : null}
                        className={`
                          border-t border-slate-700/50 transition-colors
                          ${entry.isNewRecord ? 'bg-indigo-500/20' : 'hover:bg-slate-800/50'}
                        `}
                      >
                        <td className='py-2 px-2'>
                          {entry.rank <= 3 ? (
                            <Medal
                              className={`w-4 h-4 ${getMedalColor(entry.rank)}`}
                            />
                          ) : (
                            <span className='text-slate-500 text-sm'>
                              {entry.rank}
                            </span>
                          )}
                        </td>
                        <td className='py-2 px-2'>
                          <div className='flex flex-col'>
                            <span
                              className={`font-medium text-sm ${entry.isNewRecord ? 'text-indigo-300' : 'text-white'}`}
                            >
                              {entry.playerName}
                            </span>
                            <span className='text-xs text-slate-500 capitalize'>
                              {entry.difficulty} /{' '}
                              {entry.mode === 'timeAttack'
                                ? 'Time Attack'
                                : 'Normal'}
                            </span>
                          </div>
                          {entry.isNewRecord && (
                            <span className='ml-1 text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-full'>
                              NEW
                            </span>
                          )}
                        </td>
                        <td className='py-2 px-2 text-center'>
                          <span className='text-blue-400 font-mono text-xs'>
                            {formatTime(entry.timeSeconds)}
                          </span>
                        </td>
                        <td className='py-2 px-2 text-center'>
                          <span className='text-amber-400 text-xs'>
                            {entry.score}
                          </span>
                        </td>
                        <td className='py-2 px-2 text-center'>
                          <span className='text-purple-400 text-xs'>
                            {entry.maxStreak}
                          </span>
                        </td>
                        <td className='py-2 px-2 text-center'>
                          <span className='text-emerald-400 text-xs'>
                            {entry.attempts}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className='px-6 pb-6 pt-2'>
              <Button
                onClick={fetchLeaderboard}
                disabled={isLoading}
                variant='outline'
                className='w-full bg-slate-900/50 border-slate-600 hover:bg-slate-800 text-white'
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
