'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const playerScore = searchParams.get('playerScore');
  const botScore = searchParams.get('botScore');
  const stake = searchParams.get('stake');

  if (playerScore === null || botScore === null || stake === null) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">Invalid Result Data</h1>
            <p className="text-muted-foreground mb-8">The result could not be loaded. Please try sharing again.</p>
            <Button asChild>
                <Link href="/">Play Game</Link>
            </Button>
        </div>
    );
  }

  const playerWon = Number(playerScore) > Number(botScore);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm shadow-2xl border border-primary/20 max-w-lg w-full">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">Crypto Mind Duel</h1>
            <p className="text-lg text-muted-foreground mb-6">
                A challenger has shared their game result!
            </p>
            <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-4xl font-bold mb-2">
                    {playerWon ? 'Victory! 🎉' : 'Defeat 😥'}
                </h2>
                <p className="text-6xl font-bold mb-4">
                    <span className={playerWon ? 'text-primary' : ''}>{playerScore}</span> : <span className={!playerWon ? 'text-destructive' : ''}>{botScore}</span>
                </p>
                {playerWon ? (
                    <div className="text-green-500">
                        <p className="text-xl font-bold">They won {(Number(stake) * 1.8).toFixed(4)} $MON</p>
                    </div>
                ) : (
                    <p className="text-red-500">The bot won this round.</p>
                )}
            </div>
            <Button asChild size="lg" className="mt-8 w-full font-bold glow-on-hover">
                <Link href="/">Play Your Own Game</Link>
            </Button>
        </div>
    </div>
  );
}


export default function Page() {
    return <ResultContent />;
}
