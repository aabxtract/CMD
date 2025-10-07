'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { adjustBotDifficulty, type AdjustBotDifficultyOutput } from '@/ai/flows/adjust-bot-difficulty';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  playerWinRate: z.number().min(0).max(100),
});

export default function BotDifficultyAdjuster() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdjustBotDifficultyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerWinRate: 50,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await adjustBotDifficulty(values);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="playerWinRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player Win Rate: {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Adjust Difficulty
          </Button>
        </form>
      </Form>

      {error && (
        <div className="mt-4 text-sm font-medium text-destructive">
          Error: {error}
        </div>
      )}

      {result && (
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle>Adjustment Result</CardTitle>
            <CardDescription>The AI has suggested the following adjustment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">New Bot Difficulty</h4>
              <p className={`text-lg font-bold ${
                result.newBotDifficulty === 'Hard' ? 'text-destructive' :
                result.newBotDifficulty === 'Medium' ? 'text-accent' :
                'text-primary'
              }`}>{result.newBotDifficulty}</p>
            </div>
            <div>
              <h4 className="font-semibold">Reasoning</h4>
              <p className="text-muted-foreground">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
