'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { Card as CardType } from '@/interfaces';

interface GameCardProps {
  card: CardType;
  onClick: () => void;
  isChecking: boolean;
  index: number;
  isShuffling?: boolean;
}

export function GameCard({
  card,
  onClick,
  isChecking,
  index,
  isShuffling,
}: GameCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const wasMatched = useRef(false);
  const wasFlipped = useRef(false);

  useEffect(() => {
    if (card.isMatched && !wasMatched.current && cardRef.current) {
      wasMatched.current = true;

      gsap
        .timeline()
        .to(cardRef.current, {
          scale: 1.15,
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(cardRef.current, {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
        });

      gsap.to(cardRef.current, {
        boxShadow: '0 0 40px rgba(34, 197, 94, 0.9)',
        duration: 0.3,
        yoyo: true,
        repeat: 2,
      });

      if (sparkleRef.current) {
        const sparkles = sparkleRef.current.children;
        gsap.fromTo(
          sparkles,
          { scale: 0, opacity: 1 },
          {
            scale: 1.5,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out',
          },
        );
      }
    }
  }, [card.isMatched]);

  useEffect(() => {
    if (
      wasFlipped.current &&
      !card.isFlipped &&
      !card.isMatched &&
      cardRef.current
    ) {
      gsap.to(cardRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: 'power2.inOut',
      });
      // Red flash
      gsap.to(cardRef.current, {
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
    wasFlipped.current = card.isFlipped;
  }, [card.isFlipped, card.isMatched]);

  useEffect(() => {
    if (card.isRevealed && cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
        duration: 0.3,
        repeat: 2,
        yoyo: true,
      });
    }
  }, [card.isRevealed]);

  // Shuffle animation
  useEffect(() => {
    if (isShuffling && cardRef.current && !card.isMatched) {
      gsap.to(cardRef.current, {
        rotateY: 360,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  }, [isShuffling, card.isMatched]);

  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched && !isChecking && !card.isRevealed) {
      onClick();
    }
  };

  const isClickable =
    !card.isFlipped && !card.isMatched && !isChecking && !card.isRevealed;
  const showFront = card.isFlipped || card.isMatched || card.isRevealed;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: 'easeOut',
      }}
      className='perspective-1000 relative'
      data-tutorial='card'
    >
      {/* Sparkle container */}
      <div
        ref={sparkleRef}
        className='absolute inset-0 pointer-events-none z-10'
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-yellow-400 rounded-full'
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px)`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <motion.div
        onClick={handleClick}
        className={`
          relative w-full aspect-square cursor-pointer
          ${isClickable ? 'hover:scale-105' : ''}
          transition-transform duration-200
        `}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: showFront ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        whileHover={isClickable ? { scale: 1.05 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
      >
        <div
          className={`
            absolute inset-0 rounded-xl
            bg-linear-to-br from-indigo-600 to-purple-700
            border-2 border-indigo-400/50
            flex items-center justify-center
            shadow-lg shadow-indigo-500/20
            backface-hidden
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className='text-2xl sm:text-3xl font-bold text-white/30'>?</div>
          <div className='absolute inset-2 rounded-lg border border-white/10' />
        </div>

        <div
          className={`
            absolute inset-0 rounded-xl
            ${
              card.isMatched
                ? 'bg-linear-to-br from-emerald-600 to-green-700 border-emerald-400/50'
                : card.isRevealed
                  ? 'bg-linear-to-br from-amber-600 to-orange-700 border-amber-400/50'
                  : 'bg-linear-to-br from-slate-800 to-slate-900 border-slate-600/50'
            }
            border-2 flex items-center justify-center
            shadow-lg
            backface-hidden
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative'>
            <Image
              src={card.icon}
              alt={card.name}
              fill
              className='object-contain drop-shadow-lg'
            />
          </div>

          <AnimatePresence>
            {card.isMatched && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 rounded-full flex items-center justify-center'
              >
                <svg
                  className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-900'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={3}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {card.isRevealed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className='absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-amber-400 rounded-full flex items-center justify-center'
              >
                <svg
                  className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-900'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={3}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
