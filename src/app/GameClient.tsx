'use client';

import { useState } from 'react';
import LandingScreen from '@/components/game/LandingScreen';
import GameSelection from '@/components/game/GameSelection';
import DifficultySelection from '@/components/game/DifficultySelection';
import StakeSelection from '@/components/game/StakeSelection';
import QuizGame from '@/components/game/QuizGame';
import WordScrambleGame from '@/components/game/WordScrambleGame';
import ResultModal from '@/components/game/ResultModal';

export type GameMode = 'quiz' | 'scramble';
export type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'landing' | 'game-selection' | 'difficulty-selection' | 'staking' | 'playing' | 'results';

export default function GameClient() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [gameMode, setGameMode] = useState<GameMode>('quiz');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [multiplier, setMultiplier] = useState(1);
  const [stake, setStake] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);

  const handlePlayAgain = () => {
    setPlayerScore(0);
    setBotScore(0);
    setGameState('staking');
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'game-selection':
        return <GameSelection setGameMode={setGameMode} setGameState={setGameState} />;
      case 'difficulty-selection':
        return (
          <DifficultySelection
            setDifficulty={setDifficulty}
            setMultiplier={setMultiplier}
            setGameState={setGameState}
          />
        );
      case 'staking':
        return (
          <StakeSelection
            setStake={setStake}
            setGameState={setGameState}
            gameMode={gameMode}
            difficulty={difficulty}
            multiplier={multiplier}
          />
        );
      case 'playing':
        if (gameMode === 'quiz') {
          return (
            <QuizGame
              stake={stake}
              difficulty={difficulty}
              setPlayerScore={setPlayerScore}
              setBotScore={setBotScore}
              setGameState={setGameState}
            />
          );
        }
        return (
          <WordScrambleGame
            stake={stake}
            difficulty={difficulty}
            setPlayerScore={setPlayerScore}
            setBotScore={setBotScore}
            setGameState={setGameState}
          />
        );
      case 'results':
        return (
          <ResultModal
            playerScore={playerScore}
            botScore={botScore}
            stake={stake}
            multiplier={multiplier}
            difficulty={difficulty}
            onPlayAgain={handlePlayAgain}
          />
        );
      case 'landing':
      default:
        return <LandingScreen setGameState={setGameState} />;
    }
  };

  return <div className="w-full h-full flex items-center justify-center">{renderGameState()}</div>;
}
