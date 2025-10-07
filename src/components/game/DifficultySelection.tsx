'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, Settings, Flame } from 'lucide-react';
import type { Difficulty } from '@/app/GameClient';

type DifficultySelectionProps = {
  setDifficulty: (difficulty: Difficulty) => void;
  setMultiplier: (multiplier: number) => void;
  setGameState: (state: 'staking') => void;
};

const difficultyOptions: { level: Difficulty; title: string; desc: string; icon: React.ReactNode, multiplier: number }[] = [
  { level: 'easy', title: 'Easy', desc: 'Fewer points, low reward', icon: <Puzzle className="w-8 h-8 text-green-500" />, multiplier: 1.025 },
  { level: 'medium', title: 'Medium', desc: 'More challenging, moderate reward', icon: <Settings className="w-8 h-8 text-yellow-500" />, multiplier: 1.5 },
  { level: 'hard', title: 'Hard', desc: 'Fastest thinking, high reward', icon: <Flame className="w-8 h-8 text-red-500" />, multiplier: 2 },
];

export default function DifficultySelection({ setDifficulty, setMultiplier, setGameState }: DifficultySelectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleSelectDifficulty = (level: Difficulty, multiplier: number) => {
    setSelectedDifficulty(level);
    setDifficulty(level);
    setMultiplier(multiplier);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl p-8 text-center"
    >
      <h2 className="text-4xl font-bold font-headline mb-8 text-primary">Choose Your Level ⚙️</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {difficultyOptions.map(({ level, title, desc, icon, multiplier }) => (
          <motion.div whileHover={{ scale: 1.05 }} key={level} className="h-full">
            <Card
              onClick={() => handleSelectDifficulty(level, multiplier)}
              className={`h-full cursor-pointer bg-card/80 backdrop-blur-sm shadow-lg border-2 transition-all ${
                selectedDifficulty === level ? 'border-accent shadow-accent/40' : 'border-primary/20'
              }`}
            >
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/20 rounded-full mb-2">
                  {icon}
                </div>
                <CardTitle className="font-headline text-2xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{desc}</CardDescription>
                <p className="font-bold text-lg text-accent mt-2">{multiplier}× Reward</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button
        onClick={() => setGameState('staking')}
        disabled={!selectedDifficulty}
        size="lg"
        className="font-bold text-xl glow-on-hover"
      >
        Next →
      </Button>
    </motion.div>
  );
}
