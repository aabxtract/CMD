'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { scrambleWords as allScrambleWords } from '@/lib/scramble-words';
import { Loader2 } from 'lucide-react';

type WordScrambleGameProps = {
  stake: number;
  setPlayerScore: (score: number) => void;
  setBotScore: (score: number) => void;
  setGameState: (state: 'results') => void;
};

const ROUNDS = 3;
const TIME_PER_QUESTION = 10;

const getShuffledWords = (count: number) => {
    const shuffled = [...allScrambleWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export default function WordScrambleGame({ stake, setPlayerScore, setBotScore, setGameState }: WordScrambleGameProps) {
  const [words] = useState(() => getShuffledWords(ROUNDS));
  const [currentRound, setCurrentRound] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_QUESTION);
  const [playerGuess, setPlayerGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [playerReactionTime, setPlayerReactionTime] = useState(0);
  const [botReactionTime, setBotReactionTime] = useState(0);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [isEndingGame, setIsEndingGame] = useState(false);
  const [isPlayerCorrect, setIsPlayerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setBotReactionTime(Math.random() * 4 + 2); // 2-6 seconds for bot
  }, [currentRound]);

  useEffect(() => {
    if (showResult || isEndingGame) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGuess(playerGuess, true); // Time's up
          return TIME_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRound, showResult, isEndingGame]);

  const finishGame = (finalPlayerScore: number, finalBotScore: number) => {
    setIsEndingGame(true);
    setTimeout(() => {
      setPlayerScore(finalPlayerScore);
      setBotScore(finalBotScore);
      setGameState('results');
      setIsEndingGame(false);
    }, 1500);
  };

  const handleGuess = (guess: string, timedOut = false) => {
    if (showResult) return;

    const reactionTime = timedOut ? TIME_PER_QUESTION : TIME_PER_QUESTION - timer + (Math.random() * 0.5);
    setPlayerReactionTime(reactionTime);
    setShowResult(true);

    const correct = guess.toLowerCase() === words[currentRound].answer.toLowerCase();
    setIsPlayerCorrect(correct);
    
    let newPlayerScore = score.player;
    let newBotScore = score.bot;

    if (correct) {
      if (reactionTime < botReactionTime) {
        newPlayerScore++;
      } else {
        newBotScore++;
      }
    } else {
      newBotScore++;
    }

    const updatedScore = { player: newPlayerScore, bot: newBotScore };
    setScore(updatedScore);

    setTimeout(() => {
      if (currentRound + 1 < ROUNDS) {
        setCurrentRound(currentRound + 1);
        setPlayerGuess('');
        setShowResult(false);
        setIsPlayerCorrect(null);
        setTimer(TIME_PER_QUESTION);
      } else {
        finishGame(updatedScore.player, updatedScore.bot);
      }
    }, 2000);
  };

  const currentWord = words[currentRound];

  if (isEndingGame) {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20 flex flex-col items-center justify-center space-y-4"
        >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">Finalizing results...</h3>
            <p className="text-muted-foreground text-center">Submitting your score. Please wait.</p>
        </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold">Round {currentRound + 1}/{ROUNDS}</p>
        <p className="font-bold text-lg text-accent">{timer}s</p>
      </div>
      <Progress value={(timer / TIME_PER_QUESTION) * 100} className="mb-6 h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-center mb-4">Unscramble the word:</h3>
          <p className="text-4xl md:text-5xl font-bold text-center tracking-widest mb-8 font-code uppercase">
            {currentWord.scrambled}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuess(playerGuess);
            }}
            className="flex gap-2"
          >
            <Input
              type="text"
              value={playerGuess}
              onChange={(e) => setPlayerGuess(e.target.value)}
              placeholder="Your guess..."
              disabled={showResult}
              className="text-lg h-14 text-center"
              autoFocus
            />
            <Button type="submit" size="lg" className="h-14" disabled={showResult}>
              Guess
            </Button>
          </form>
        </motion.div>
      </AnimatePresence>

      {showResult && (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
        >
            <h4 className={`text-3xl font-bold ${isPlayerCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isPlayerCorrect ? "Correct ✅" : "Wrong ❌"}
            </h4>
            <div className="flex justify-around mt-4 text-muted-foreground">
                <p>Your speed: {playerReactionTime.toFixed(2)}s</p>
                <p>Bot speed: {botReactionTime.toFixed(2)}s</p>
            </div>
            {!isPlayerCorrect && <p className="mt-2 text-sm text-center">Correct word: {words[currentRound].answer}</p>}
            {isPlayerCorrect && playerReactionTime > botReactionTime && <p className="text-sm mt-2 font-bold text-red-500">Bot was faster!</p>}
        </motion.div>
      )}
    </motion.div>
  );
}
