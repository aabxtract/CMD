import BotDifficultyAdjuster from './BotDifficultyAdjuster';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline">Bot Difficulty Adjuster</CardTitle>
          <CardDescription>
            Use AI to analyze the current player win-rate and automatically adjust bot difficulty.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BotDifficultyAdjuster />
        </CardContent>
      </Card>
    </div>
  );
}
