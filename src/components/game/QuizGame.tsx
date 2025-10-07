'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { questions as allQuestions } from '@/lib/questions';

type QuizGameProps = {
  setPlayerScore: (score: number) => void;
  setBotScore: (score: number) => void;
  setGameState: (state: 'results') => void;
};

const ROUNDS = 3;
const TIME_PER_QUESTION = 10;

const getShuffledQuestions = (count: number) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export default function QuizGame({ setPlayerScore, setBotScore, setGameState }: QuizGameProps) {
  const [questions] = useState(() => getShuffledQuestions(ROUNDS));
  const [currentRound, setCurrentRound] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_QUESTION);
  const [playerAnswer, setPlayerAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playerReactionTime, setPlayerReactionTime] = useState(0);
  const [botReactionTime, setBotReactionTime] = useState(0);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setBotReactionTime(Math.random() * 2 + 1); // 1-3 seconds for bot
  }, [currentRound]);

  useEffect(() => {
    if (showResult) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(null); // Time's up
          return TIME_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRound, showResult]);

  const handleAnswer = (answer: string | null) => {
    if (playerAnswer !== null) return;

    const reactionTime = TIME_PER_QUESTION - timer + (Math.random() * 0.5); // add small random delay for realism
    setPlayerReactionTime(reactionTime);
    setPlayerAnswer(answer);
    setShowResult(true);

    const isPlayerCorrect = answer === questions[currentRound].answer;
    const isBotCorrect = Math.random() > 0.3; // 70% chance bot is correct

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
    } else { // Both wrong
        setStreak(0);
    }

    setScore({ player: newPlayerScore, bot: newBotScore });

    setTimeout(() => {
      if (currentRound + 1 < ROUNDS) {
        setCurrentRound(currentRound + 1);
        setPlayerAnswer(null);
        setShowResult(false);
        setTimer(TIME_PER_QUESTION);
      } else {
        setPlayerScore(newPlayerScore);
        setBotScore(newBotScore);
        setGameState('results');
      }
    }, 2000);
  };

  const currentQuestion = questions[currentRound];
  const isCorrect = playerAnswer === currentQuestion.answer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold">Round {currentRound + 1}/{ROUNDS}</p>
        <div className="flex items-center gap-4">
            <span className="text-amber-400 font-bold">🔥 {streak}</span>
            <p className="font-bold text-lg text-accent">{timer}s</p>
        </div>
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
