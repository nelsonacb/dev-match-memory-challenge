'use client'

import { useCallback, useRef, useEffect } from 'react'
import { SoundType } from '@/interfaces'

const SOUND_URLS: Record<SoundType, string> = {
  flip: '/sounds/flip.mp3',
  match: '/sounds/match.mp3',
  error: '/sounds/error.mp3',
  victory: '/sounds/victory.mp3',
  gameOver: '/sounds/gameover.mp3',
  combo: '/sounds/combo.mp3',
  powerUp: '/sounds/powerup.mp3',
  tick: '/sounds/tick.mp3',
}

// Web Audio API based sound generation for lightweight game sounds
function createSound(type: SoundType): () => void {
  return () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      const now = audioContext.currentTime
      
      switch (type) {
        case 'flip':
          oscillator.frequency.setValueAtTime(800, now)
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
          oscillator.start(now)
          oscillator.stop(now + 0.1)
          break
          
        case 'match':
          oscillator.frequency.setValueAtTime(523, now)
          oscillator.frequency.setValueAtTime(659, now + 0.1)
          oscillator.frequency.setValueAtTime(784, now + 0.2)
          gainNode.gain.setValueAtTime(0.15, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
          oscillator.start(now)
          oscillator.stop(now + 0.3)
          break
          
        case 'error':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(200, now)
          oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
          oscillator.start(now)
          oscillator.stop(now + 0.2)
          break
          
        case 'combo':
          oscillator.frequency.setValueAtTime(600, now)
          oscillator.frequency.setValueAtTime(800, now + 0.05)
          oscillator.frequency.setValueAtTime(1000, now + 0.1)
          oscillator.frequency.setValueAtTime(1200, now + 0.15)
          gainNode.gain.setValueAtTime(0.12, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
          oscillator.start(now)
          oscillator.stop(now + 0.25)
          break
          
        case 'victory':
          const notes = [523, 659, 784, 1047]
          notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator()
            const gain = audioContext.createGain()
            osc.connect(gain)
            gain.connect(audioContext.destination)
            osc.frequency.setValueAtTime(freq, now + i * 0.15)
            gain.gain.setValueAtTime(0.15, now + i * 0.15)
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3)
            osc.start(now + i * 0.15)
            osc.stop(now + i * 0.15 + 0.3)
          })
          return
          
        case 'gameOver':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(400, now)
          oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
          oscillator.start(now)
          oscillator.stop(now + 0.5)
          break
          
        case 'powerUp':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(400, now)
          oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.2)
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.3)
          gainNode.gain.setValueAtTime(0.15, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
          oscillator.start(now)
          oscillator.stop(now + 0.3)
          break
          
        case 'tick':
          oscillator.frequency.setValueAtTime(1000, now)
          gainNode.gain.setValueAtTime(0.05, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
          oscillator.start(now)
          oscillator.stop(now + 0.05)
          break
      }
    } catch {
      // Audio not supported or blocked
    }
  }
}

export function useSound() {
  const soundsRef = useRef<Map<SoundType, () => void>>(new Map())
  const enabledRef = useRef(true)

  useEffect(() => {
    // Pre-create sound functions
    const types: SoundType[] = ['flip', 'match', 'error', 'victory', 'gameOver', 'combo', 'powerUp', 'tick']
    types.forEach(type => {
      soundsRef.current.set(type, createSound(type))
    })
  }, [])

  const play = useCallback((type: SoundType) => {
    if (!enabledRef.current) return
    const sound = soundsRef.current.get(type)
    if (sound) sound()
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled
  }, [])

  return { play, setEnabled, isEnabled: enabledRef.current }
}
