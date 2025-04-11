import React, { useState, useEffect } from "react";
import { useAudio } from './BackgroundMusic';
import { IoVolumeHighOutline, IoVolumeMuteOutline, IoVolumeLowOutline, IoVolumeMediumOutline } from "react-icons/io5";
import { toggleMuteSounds, sounds, toggleAllSounds, unlockAudio } from '../lib/soundManager';
import { motion } from 'framer-motion';

interface VolumeControlProps {
  className?: string;
}

export function MuteButton({ className = '' }: VolumeControlProps) {
  const { isMuted, toggleMute, volume, increaseVolume, decreaseVolume } = useAudio();

  // Initialize sounds when component mounts
  useEffect(() => {
    // Always try to unlock audio - this is important for mobile browsers
    unlockAudio();
    
    // Ensure all sounds match the mute state from context
    toggleAllSounds(!isMuted);
  }, [isMuted]);

  // Play sound when volume is changed
  const handleDecreaseVolume = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    unlockAudio(); // Unlock audio first
    sounds.click(); // Play click sound
    decreaseVolume();
  };

  const handleIncreaseVolume = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    unlockAudio(); // Unlock audio first
    sounds.click(); // Play click sound
    increaseVolume();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    unlockAudio(); // Unlock audio first
    
    // Calculate the new mute state before toggling
    const newMuteState = !isMuted;
    
    // Toggle mute state for the background music
    toggleMute();
    
    // Also toggle all sound effects (pass the correct new state - not inverted)
    toggleAllSounds(newMuteState); // true means sounds are enabled
    
    // Play a sound only when unmuting
    if (isMuted) {
      setTimeout(() => sounds.click(), 50); // Slight delay to ensure sound plays after unmuting
    }
  };

  const getVolumeIcon = () => {
    if (isMuted) return <IoVolumeMuteOutline className="w-5 h-5 sm:w-6 sm:h-6" />;
    if (volume > 0.7) return <IoVolumeHighOutline className="w-5 h-5 sm:w-6 sm:h-6" />;
    if (volume > 0.3) return <IoVolumeMediumOutline className="w-5 h-5 sm:w-6 sm:h-6" />;
    return <IoVolumeLowOutline className="w-5 h-5 sm:w-6 sm:h-6" />;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <motion.button 
        onClick={handleDecreaseVolume}
        whileTap={{ scale: 0.9 }}
        whileHover={{ color: '#5eead4' }}
        className="p-2 text-purple-300 transition-all relative group"
        aria-label="Decrease Volume"
        title="Decrease Volume"
      >
        <IoVolumeLowOutline className="w-4 h-4" />
        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">-</span>
      </motion.button>

      <motion.button 
        onClick={handleToggleMute}
        whileTap={{ scale: 0.9 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 0 20px rgba(138, 79, 219, 0.6)'
        }}
        animate={{
          boxShadow: isMuted 
            ? '0 0 8px rgba(255, 75, 75, 0.6)' 
            : '0 0 16px rgba(138, 79, 219, 0.5)',
          borderColor: isMuted 
            ? 'rgba(255, 75, 75, 0.5)' 
            : 'rgba(138, 79, 219, 0.5)'
        }}
        className="header-button flex items-center justify-center gap-2 bg-purple-900/50 backdrop-blur-sm p-3 rounded-lg border-2 transition-all duration-200 min-w-[46px] min-h-[46px]"
        style={{ transform: 'translateZ(0)' }}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <motion.div
          animate={{ 
            rotate: isMuted ? [0, 5, -5, 0] : 0,
            scale: isMuted ? 0.9 : 1
          }}
          transition={{ duration: 0.3 }}
          className={isMuted ? 'text-red-400' : 'text-cyan-300'}
        >
          {getVolumeIcon()}
        </motion.div>
      </motion.button>

      <motion.button 
        onClick={handleIncreaseVolume}
        whileTap={{ scale: 0.9 }}
        whileHover={{ color: '#5eead4' }}
        className="p-2 text-purple-300 transition-all relative group"
        aria-label="Increase Volume"
        title="Increase Volume"
      >
        <IoVolumeHighOutline className="w-4 h-4" />
        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
      </motion.button>
    </div>
  );
}