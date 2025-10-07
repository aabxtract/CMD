'use client';

import { useState } from 'react';
import LandingScreen from '@/components/game/LandingScreen';
import StakeSelection from '@/components/game/StakeSelection';
import QuizGame from '@/components/game/QuizGame';
import ResultModal from '@/components/game/ResultModal';

type GameState = 'landing' | 'staking' | 'playing' | 'results';

export default function GameClient() {
  const [gameState, setGameState] = useState<GameState>('landing');
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
      case 'staking':
        return <StakeSelection setStake={setStake} setGameState={setGameState} />;
      case 'playing':
        return (
          <QuizGame
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
