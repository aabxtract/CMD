'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Leaderboard from '@/components/game/Leaderboard';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

type LandingScreenProps = {
  setGameState: (state: 'game-selection') => void;
};

export default function LandingScreen({ setGameState }: LandingScreenProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20 max-w-2xl"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="p-4 bg-primary/20 rounded-full mb-4"
        >
          <Trophy className="w-16 h-16 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary mb-2">
          Crypto Mind Duel
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Stake. Think Fast. Win $MON.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setGameState('game-selection')}
            size="lg"
            className="font-bold text-lg glow-on-hover"
          >
            Play Now
          </Button>
          <Button
            onClick={() => setShowLeaderboard(true)}
            variant="outline"
            size="lg"
            className="font-bold text-lg"
          >
            Leaderboard
          </Button>
        </div>
      </motion.div>
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </>
  );
}
