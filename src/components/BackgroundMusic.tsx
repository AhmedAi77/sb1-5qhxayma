import React, { useEffect, useRef, useState, createContext, useContext } from 'react';

// Create a context for the audio controls
interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isPlaying: boolean;
  startPlaying: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => {},
  isPlaying: false,
  startPlaying: () => {},
  volume: 0.5,
  setVolume: () => {},
  increaseVolume: () => {},
  decreaseVolume: () => {}
});

// Provider component to manage audio state
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [hasInitialized, setHasInitialized] = useState(true); // Set to true by default now
  
  // Remove the effect that required first interaction
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    // Start playing if not already playing when unmuting
    if (isMuted && !isPlaying) {
      setIsPlaying(true);
    }
    console.log('Toggle mute:', !isMuted);
  };
  
  const startPlaying = () => {
    setIsPlaying(true);
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    setVolumeState(clampedVolume);
    // If volume is changed and we're muted, unmute
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false);
    }
    console.log('Set volume to:', clampedVolume);
  };

  const increaseVolume = () => {
    setVolumeState(prev => {
      const newVolume = Math.min(prev + 0.1, 1);
      console.log('Increased volume to:', newVolume);
      return newVolume;
    });
  };

  const decreaseVolume = () => {
    setVolumeState(prev => {
      const newVolume = Math.max(prev - 0.1, 0);
      console.log('Decreased volume to:', newVolume);
      return newVolume;
    });
  };
  
  return (
    <AudioContext.Provider value={{ 
      isMuted, 
      toggleMute, 
      isPlaying, 
      startPlaying, 
      volume, 
      setVolume,
      increaseVolume,
      decreaseVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
}

// Hook to use the audio context
export function useAudio() {
  return useContext(AudioContext);
}

interface BackgroundMusicProps {
  audioSrc: string;
  volume?: number;
}

export function BackgroundMusic({ audioSrc, volume = 0.3 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, isPlaying, startPlaying, volume: contextVolume } = useAudio();
  
  // Create the audio element
  useEffect(() => {
    // Create audio context to unlock web audio API
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      // Resume the audio context
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
    
    audioRef.current = new Audio(audioSrc);
    audioRef.current.loop = true;
    audioRef.current.volume = contextVolume;
    audioRef.current.preload = 'auto';
    
    // Auto-start playing as soon as possible
    startPlaying();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioSrc, startPlaying, contextVolume]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      console.log('Applying volume change:', contextVolume);
      audioRef.current.volume = contextVolume;
    }
  }, [contextVolume]);

  // Handle play/pause based on isPlaying state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const playAudio = () => {
      if (isPlaying && !audio.paused) return;
      
      // Try multiple methods to start audio playback
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Auto-play prevented:', error);
          
          // Add a retry mechanism with a small delay
          setTimeout(() => {
            audio.play().catch(e => console.log('Retry failed:', e));
          }, 500);
        });
      }
    };
    
    if (isPlaying) {
      playAudio();
    } else {
      audio.pause();
    }
    
    // Setup a retry mechanism for mobile devices
    const retryInterval = setInterval(() => {
      if (isPlaying && audio.paused) {
        playAudio();
      }
    }, 1000);
    
    return () => {
      clearInterval(retryInterval);
    };
  }, [isPlaying]);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      
      // If we're unmuting and audio is paused, try to play
      if (!isMuted && audioRef.current.paused && isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('Failed to play audio on unmute:', err);
          
          // Add a retry mechanism with a small delay
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Unmute retry failed:', e));
            }
          }, 300);
        });
      }
      
      console.log('Audio muted state changed to:', isMuted);
    }
  }, [isMuted, isPlaying]);

  // This component doesn't render anything visible
  return null;
} 