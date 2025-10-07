'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

type ResultModalProps = {
  playerScore: number;
  botScore: number;
  stake: number;
  onPlayAgain: () => void;
};

export default function ResultModal({ playerScore, botScore, stake, onPlayAgain }: ResultModalProps) {
  const playerWon = playerScore > botScore;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (playerWon && canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
      myConfetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 }
      });
    }
  }, [playerWon]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-50" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20"
      >
        <h2 className="text-5xl font-bold font-headline mb-4">
          You {playerWon ? 'Won!' : 'Lost'}
        </h2>
        <p className="text-7xl font-bold mb-4">
          <span className={playerWon ? 'text-primary' : ''}>{playerScore}</span> : <span className={!playerWon ? 'text-destructive' : ''}>{botScore}</span>
        </p>

        {playerWon ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-lg text-green-500 mb-8"
          >
            You beat the bot! +1.8× reward 💰
            <p className="text-2xl font-bold">You won {(stake * 1.8).toFixed(4)} $MON</p>
            <p className="text-sm font-bold mt-2 text-foreground">You’re too fast for Web3!</p>
          </motion.div>
        ) : (
          <p className="text-lg text-red-500 mb-8">
            The bot won this round 😞
            <p className="text-sm font-bold mt-2 text-foreground">"Bot's brain is overclocked 🤖⚡️"</p>
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={onPlayAgain} size="lg" className="font-bold text-lg glow-on-hover">
            Play Again
          </Button>
          <Button variant="outline" size="lg" className="font-bold text-lg" disabled>
            Share to Farcaster
          </Button>
        </div>
      </motion.div>
    </>
  );
}
