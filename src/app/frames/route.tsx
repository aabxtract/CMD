import { Button } from 'frames.js/next';
import { createFrames } from 'frames.js/next';

const frames = createFrames({
    basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
    const { playerScore, botScore, stake } = ctx.searchParams;
    const playerWon = Number(playerScore) > Number(botScore);
    const resultText = playerWon ? "You Won!" : "You Lost";

    return {
        image: (
            <div tw="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
                <h1 tw="text-6xl font-bold">Crypto Mind Duel</h1>
                <div tw="flex flex-col items-center justify-center mt-8 p-8 rounded-2xl bg-white/10">
                    <h2 tw="text-5xl font-bold mb-4">
                        {resultText}
                    </h2>
                    <p tw="text-7xl font-bold mb-4">
                        <span tw={playerWon ? 'text-green-400' : ''}>{playerScore}</span> : <span tw={!playerWon ? 'text-red-400' : ''}>{botScore}</span>
                    </p>
                    {playerWon ? (
                        <div tw="flex flex-col items-center text-green-400">
                            <p tw="text-2xl font-bold">You won {(Number(stake) * 1.8).toFixed(4)} $MON</p>
                        </div>
                    ) : (
                        <p tw="text-2xl text-red-400">The bot won this round.</p>
                    )}
                </div>
                <p tw="text-2xl mt-6">Can you beat this score?</p>
            </div>
        ),
        buttons: [
            <Button action="link" target={`${process.env.NEXT_PUBLIC_HOST}`}>
                Play Now
            </Button>,
        ],
        imageOptions: {
            aspectRatio: '1.91:1'
        }
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
