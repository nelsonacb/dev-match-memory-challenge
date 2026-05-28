'use client';

import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export function GameHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='text-center py-6'
    >
      <div className='flex items-center justify-center gap-3 mb-2'>
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <Gamepad2 className='w-10 h-10 text-indigo-400' />
        </motion.div>
        <h1 className='text-3xl sm:text-4xl font-bold'>
          <span className='bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
            DevMatch
          </span>
        </h1>
      </div>
      <p className='text-slate-400 text-sm sm:text-base'>
        Match the tech stack pairs to win!
      </p>
    </motion.header>
  );
}
