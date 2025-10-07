'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { GameMode } from '@/app/GameClient';

type StakeSelectionProps = {
  setStake: (stake: number) => void;
  setGameState: (state: 'playing') => void;
  gameMode: GameMode;
};

const stakeOptions = [0.005, 0.01, 0.05];

export default function StakeSelection({ setStake, setGameState, gameMode }: StakeSelectionProps) {
  const [balance, setBalance] = useState(0.1);
  const [selectedStake, setSelectedStake] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmStake = () => {
    if (selectedStake === null) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStake(selectedStake);
      setGameState('playing');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20 text-center"
    >
      <h2 className="text-3xl font-bold font-headline mb-2">Choose Your Stake 💰</h2>
      <p className="text-sm text-accent font-semibold mb-4">
        Game Mode: {gameMode === 'quiz' ? 'Crypto Quiz' : 'Word Scramble'}
      </p>
      <p className="text-muted-foreground mb-6">Your Balance: {balance.toFixed(4)} $MON</p>


      <div className="grid grid-cols-3 gap-4 mb-8">
        {stakeOptions.map((stake) => (
          <Button
            key={stake}
            variant={selectedStake === stake ? 'default' : 'outline'}
            className={`text-lg font-bold h-20 transition-all duration-300 ${selectedStake === stake ? 'glow-on-hover' : ''}`}
            onClick={() => setSelectedStake(stake)}
            disabled={isLoading || balance < stake}
          >
            {stake} <span className="text-xs ml-1">$MON</span>
          </Button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full font-bold text-lg"
        onClick={handleConfirmStake}
        disabled={selectedStake === null || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm Stake'
        )}
      </Button>
    </motion.div>
  );
}
