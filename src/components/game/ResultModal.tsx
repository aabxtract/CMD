'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import type { Difficulty } from '@/app/GameClient';
import { Loader2, Home } from 'lucide-react';

type ResultModalProps = {
  playerScore: number;
  botScore: number;
  stake: number;
  multiplier: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onGoHome: () => void;
};

export default function ResultModal({ playerScore, botScore, stake, multiplier, difficulty, onPlayAgain, onGoHome }: ResultModalProps) {
  const playerWon = playerScore > botScore;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const reward = useMemo(() => {
    if (!playerWon) return 0;
    return stake * (1 + (multiplier -1) * 0.8) // Base stake + 80% of bonus multiplier
  }, [stake, multiplier, playerWon]);

  useEffect(() => {
    if (playerWon && canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });

      const particleCount = difficulty === 'hard' ? 400 : difficulty === 'medium' ? 200 : 100;
      const spread = difficulty === 'hard' ? 220 : difficulty === 'medium' ? 160 : 120;
      
      myConfetti({
        particleCount,
        spread,
        origin: { y: 0.6 }
      });
    }
  }, [playerWon, difficulty]);

  const handleClaim = () => {
    setIsClaiming(true);
    // Simulate API call
    setTimeout(() => {
      setIsClaiming(false);
      setIsClaimed(true);
    }, 2000);
  };

  const farcasterShareUrl = useMemo(() => {
    const text = encodeURIComponent(`I scored ${playerScore}:${botScore} in Crypto Mind Duel on ${difficulty} mode! Can you beat me?`);
    const embedUrl = `${process.env.NEXT_PUBLIC_HOST}/frames/result?playerScore=${playerScore}&botScore=${botScore}&stake=${stake}`;
    return `https://warpcast.com/~/compose?text=${text}&embeds[]=${embedUrl}`;
  }, [playerScore, botScore, stake, difficulty]);
  
  const winMessage = useMemo(() => {
    switch (difficulty) {
        case 'hard':
            return '🔥 LEGENDARY WIN 🔥';
        case 'medium':
            return 'Impressive Speed!';
        default:
            return 'You beat the bot!';
    }
  }, [difficulty]);


  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-50" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20 max-w-lg w-full"
      >
        <h2 className={`text-5xl font-bold font-headline mb-4 ${playerWon && difficulty === 'hard' ? 'text-amber-400 animate-pulse' : ''}`}>
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
            {winMessage}
            <p className="text-2xl font-bold">You won {reward.toFixed(4)} $MON</p>
            <p className="text-sm font-bold mt-2 text-foreground">Base: {stake} $MON × {multiplier} = {(stake * multiplier).toFixed(4)}</p>
          </motion.div>
        ) : (
          <p className="text-lg text-red-500 mb-8">
            The bot won this round 😞
            <p className="text-sm font-bold mt-2 text-foreground">"Bot's brain is overclocked 🤖⚡️"</p>
          </p>
        )}

        <div className="flex flex-col gap-4 justify-center">
          {playerWon && (
            <Button onClick={handleClaim} size="lg" className="font-bold text-lg glow-on-hover" disabled={isClaiming || isClaimed}>
              {isClaiming && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isClaiming ? 'Claiming...' : isClaimed ? 'Rewards Claimed ✅' : 'Claim Rewards'}
            </Button>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={onPlayAgain} size="lg" className="font-bold text-lg" variant={playerWon ? 'secondary' : 'default'}>
              Play Again
            </Button>
            <Button variant="outline" size="lg" asChild className="font-bold text-lg">
              <Link href={farcasterShareUrl} target="_blank">
                  Share to Farcaster
              </Link>
            </Button>
          </div>
           <Button onClick={onGoHome} variant="link" className="mt-2 text-muted-foreground">
              <Home className="mr-2 h-4 w-4" /> Go to Game Selection
            </Button>
        </div>
      </motion.div>
    </>
  );
}
