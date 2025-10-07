'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Coins, Puzzle } from 'lucide-react';
import type { GameMode } from '@/app/GameClient';

type GameSelectionProps = {
  setGameMode: (mode: GameMode) => void;
  setGameState: (state: 'staking') => void;
};

export default function GameSelection({ setGameMode, setGameState }: GameSelectionProps) {
  const handleSelectGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('staking');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl p-8 text-center"
    >
      <h2 className="text-4xl font-bold font-headline mb-8 text-primary">Choose Your Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div whileHover={{ scale: 1.05 }} className="h-full">
          <Card
            onClick={() => handleSelectGame('quiz')}
            className="h-full cursor-pointer bg-card/80 backdrop-blur-sm shadow-lg border border-primary/20 hover:border-accent hover:shadow-accent/20 transition-all"
          >
            <CardHeader className="items-center">
              <div className="p-4 bg-primary/20 rounded-full mb-2">
                <Coins className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">Crypto Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Answer fast, think faster.</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="h-full">
          <Card
            onClick={() => handleSelectGame('scramble')}
            className="h-full cursor-pointer bg-card/80 backdrop-blur-sm shadow-lg border border-primary/20 hover:border-accent hover:shadow-accent/20 transition-all"
          >
            <CardHeader className="items-center">
              <div className="p-4 bg-primary/20 rounded-full mb-2">
                <Puzzle className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">Word Scramble</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Unscramble crypto words before the bot!</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
