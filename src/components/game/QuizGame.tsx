'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { questions as allQuestions, web3Questions } from '@/lib/questions';
import { Loader2 } from 'lucide-react';
import type { Difficulty } from '@/app/GameClient';

type QuizGameProps = {
  stake: number;
  difficulty: Difficulty;
  setPlayerScore: (score: number) => void;
  setBotScore: (score: number) => void;
  setGameState: (state: 'results') => void;
};

const getShuffledQuestions = (count: number, difficulty: Difficulty) => {
    const questionPool = difficulty === 'hard' ? [...allQuestions, ...web3Questions] : allQuestions;
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export default function QuizGame({ stake, difficulty, setPlayerScore, setBotScore, setGameState }: QuizGameProps) {
  const { rounds, timePerQuestion } = useMemo(() => {
    switch (difficulty) {
      case 'hard':
        return { rounds: 5, timePerQuestion: 6 };
      case 'medium':
        return { rounds: 4, timePerQuestion: 8 };
      case 'easy':
      default:
        return { rounds: 3, timePerQuestion: 10 };
    }
  }, [difficulty]);

  const [questions] = useState(() => getShuffledQuestions(rounds, difficulty));
  const [currentRound, setCurrentRound] = useState(0);
  const [timer, setTimer] = useState(timePerQuestion);
  const [playerAnswer, setPlayerAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playerReactionTime, setPlayerReactionTime] = useState(0);
  const [botReactionTime, setBotReactionTime] = useState(0);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [streak, setStreak] = useState(0);
  const [isEndingGame, setIsEndingGame] = useState(false);

  useEffect(() => {
    let botSpeed = 2; // Medium
    if (difficulty === 'easy') botSpeed = 3;
    if (difficulty === 'hard') botSpeed = 1.5;
    setBotReactionTime(Math.random() * 2 + botSpeed); // Bot reaction time based on difficulty
  }, [currentRound, difficulty]);

  useEffect(() => {
    if (showResult || isEndingGame) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(null); // Time's up
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRound, showResult, isEndingGame, timePerQuestion]);

  const finishGame = (finalPlayerScore: number, finalBotScore: number) => {
    setIsEndingGame(true);
    setTimeout(() => {
      setPlayerScore(finalPlayerScore);
      setBotScore(finalBotScore);
      setGameState('results');
      setIsEndingGame(false);
    }, 1500);
  };

  const handleAnswer = (answer: string | null) => {
    if (playerAnswer !== null) return;

    const reactionTime = timePerQuestion - timer + (Math.random() * 0.5);
    setPlayerReactionTime(reactionTime);
    setPlayerAnswer(answer);
    setShowResult(true);

    const isPlayerCorrect = answer === questions[currentRound].answer;
    
    let botCorrectness = 0.7; // Medium
    if (difficulty === 'easy') botCorrectness = 0.5;
    if (difficulty === 'hard') botCorrectness = 0.9;
    const isBotCorrect = Math.random() < botCorrectness;

    let newPlayerScore = score.player;
    let newBotScore = score.bot;

    if (isPlayerCorrect && !isBotCorrect) {
      newPlayerScore++;
      setStreak(s => s + 1);
    } else if (!isPlayerCorrect && isBotCorrect) {
      newBotScore++;
      setStreak(0);
    } else if (isPlayerCorrect && isBotCorrect) {
      if (reactionTime < botReactionTime) {
        newPlayerScore++;
        setStreak(s => s + 1);
      } else {
        newBotScore++;
        setStreak(0);
      }
    } else {
        setStreak(0);
    }

    const updatedScore = { player: newPlayerScore, bot: newBotScore };
    setScore(updatedScore);

    setTimeout(() => {
      if (currentRound + 1 < rounds) {
        setCurrentRound(currentRound + 1);
        setPlayerAnswer(null);
        setShowResult(false);
        setTimer(timePerQuestion);
      } else {
        finishGame(updatedScore.player, updatedScore.bot);
      }
    }, 2000);
  };

  const currentQuestion = questions[currentRound];
  const isCorrect = playerAnswer === currentQuestion.answer;

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
        <p className="font-bold">Round {currentRound + 1}/{rounds}</p>
        <div className="flex items-center gap-4">
            <span className="text-amber-400 font-bold">🔥 {streak}</span>
            <p className="font-bold text-lg text-accent">{timer}s</p>
        </div>
      </div>
      <Progress value={(timer / timePerQuestion) * 100} className="mb-6 h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-center mb-8 min-h-[84px] flex items-center justify-center">
            {currentQuestion.question}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={playerAnswer !== null}
                className={`h-16 text-lg justify-start p-4 transition-colors duration-300 relative
                  ${
                    showResult && option === currentQuestion.answer
                      ? 'bg-green-500 hover:bg-green-600 text-white border-green-400'
                      : ''
                  }
                  ${
                    showResult && option !== currentQuestion.answer && option === playerAnswer
                      ? 'bg-red-500 hover:bg-red-600 text-white border-red-400'
                      : 'hover:bg-primary/10'
                  }
                `}
                variant="outline"
              >
                {option}
              </Button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {showResult && (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
        >
            <h4 className={`text-3xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? "Correct ✅" : "Wrong ❌"}
            </h4>
            <div className="flex justify-around mt-4 text-muted-foreground">
                <p>Your speed: {playerReactionTime.toFixed(2)}s</p>
                <p>Bot speed: {botReactionTime.toFixed(2)}s</p>
            </div>
            {playerAnswer !== null && !isCorrect && <p className="mt-2 text-sm text-center">Correct answer: {questions[currentRound].answer}</p>}
            {isCorrect && playerReactionTime > botReactionTime && <p className="text-sm mt-2 font-bold text-red-500">Bot was faster!</p>}
            {!isCorrect && <p className="text-sm mt-2 font-bold text-muted-foreground">Bot's brain lagged 🤖💀</p>}
        </motion.div>
      )}
    </motion.div>
  );
}
