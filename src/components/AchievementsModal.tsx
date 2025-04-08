import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Achievement } from '../types';
import * as Icons from 'lucide-react';

interface Props {
  achievements: Achievement[];
  onClose: () => void;
}

export function AchievementsModal({ achievements, onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card rounded-xl w-full max-w-lg p-6 space-y-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display text-yellow-600/90">Achievements</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2D1B4E]/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-yellow-600/90" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {achievements.map(achievement => {
              const Icon = Icons[achievement.icon as keyof typeof Icons];
              const progress = (achievement.progress / achievement.requirement) * 100;
              const isUnlocked = achievement.progress >= achievement.requirement;
              
              return (
                <div
                  key={achievement.id}
                  className={`glass-effect rounded-lg p-4 ${
                    isUnlocked ? 'border-yellow-600/30' : 'border-purple-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      isUnlocked ? 'bg-yellow-600/20' : 'bg-[#2D1B4E]/30'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isUnlocked ? 'text-yellow-400' : 'text-purple-400/60'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-display ${
                        isUnlocked ? 'text-yellow-600/90' : 'text-purple-200/60'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-purple-200/60 mb-2">
                        {achievement.description}
                      </p>
                      <div className="h-2 bg-[#2D1B4E]/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full rounded-full ${
                            isUnlocked ? 'progress-animate' : 'bg-purple-500/40'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-purple-200/40 mt-1">
                        {achievement.progress} / {achievement.requirement}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}