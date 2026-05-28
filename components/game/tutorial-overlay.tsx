'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TUTORIAL_STEPS } from '@/lib/game-data';
import { hasTutorialBeenSeen, markTutorialAsSeen } from '@/lib/game-utils';

interface TutorialOverlayProps {
  onComplete: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasTutorialBeenSeen()) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    markTutorialAsSeen();
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    markTutorialAsSeen();
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='relative w-full max-w-md bg-linear-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden'
        >
          <button
            onClick={handleSkip}
            className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10'
          >
            <X className='w-5 h-5' />
          </button>

          <div className='pt-8 pb-4 px-6 text-center'>
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30'
            >
              <Gamepad2 className='w-8 h-8 text-white' />
            </motion.div>

            <motion.h2
              key={`title-${currentStep}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className='text-xl font-bold text-white mb-2'
            >
              {step.title}
            </motion.h2>

            <motion.p
              key={`desc-${currentStep}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className='text-slate-400 text-sm leading-relaxed'
            >
              {step.description}
            </motion.p>
          </div>

          <div className='flex justify-center gap-2 py-4'>
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-6 bg-indigo-500'
                    : index < currentStep
                      ? 'bg-indigo-400'
                      : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className='px-6 pb-6 flex gap-3'>
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant='outline'
              className='flex-1 bg-slate-900/50 border-slate-600 hover:bg-slate-800 text-white disabled:opacity-50'
            >
              <ChevronLeft className='w-4 h-4 mr-1' />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className='flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0'
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                "Let's Play!"
              ) : (
                <>
                  Next
                  <ChevronRight className='w-4 h-4 ml-1' />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
