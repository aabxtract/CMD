'use client';

import { useState } from 'react';
import LandingScreen from '@/components/game/LandingScreen';
import GameSelection from '@/components/game/GameSelection';
import StakeSelection from '@/components/game/StakeSelection';
import QuizGame from '@/components/game/QuizGame';
import WordScrambleGame from '@/components/game/WordScrambleGame';
import ResultModal from '@/components/game/ResultModal';

export type GameMode = 'quiz' | 'scramble';
type GameState = 'landing' | 'game-selection' | 'staking' | 'playing' | 'results';

export default function GameClient() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [gameMode, setGameMode] = useState<GameMode>('quiz');
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
      case 'staking':
        return <StakeSelection setStake={setStake} setGameState={setGameState} gameMode={gameMode} />;
      case 'playing':
        if (gameMode === 'quiz') {
          return (
            <QuizGame
              stake={stake}
              setPlayerScore={setPlayerScore}
              setBotScore={setBotScore}
              setGameState={setGameState}
            />
          );
        }
        return (
          <WordScrambleGame
            stake={stake}
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
