'use server';

/**
 * @fileOverview This flow adjusts the bot's difficulty based on the player win rate.
 *
 * adjustBotDifficulty - Adjusts the bot difficulty based on the current win rate.
 * AdjustBotDifficultyInput - The input type for the adjustBotDifficulty function.
 * AdjustBotDifficultyOutput - The return type for the adjustBotDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustBotDifficultyInputSchema = z.object({
  playerWinRate: z
    .number()
    .describe("The player's current win rate as a percentage (0-100)."),
});
export type AdjustBotDifficultyInput = z.infer<typeof AdjustBotDifficultyInputSchema>;

const AdjustBotDifficultyOutputSchema = z.object({
  newBotDifficulty: z
    .string()
    .describe(
      'The new bot difficulty setting, which can be one of: Easy, Medium, or Hard.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why the bot difficulty was adjusted based on the provided player win rate.'
    ),
});
export type AdjustBotDifficultyOutput = z.infer<typeof AdjustBotDifficultyOutputSchema>;

export async function adjustBotDifficulty(input: AdjustBotDifficultyInput): Promise<AdjustBotDifficultyOutput> {
  return adjustBotDifficultyFlow(input);
}

const adjustBotDifficultyPrompt = ai.definePrompt({
  name: 'adjustBotDifficultyPrompt',
  input: {schema: AdjustBotDifficultyInputSchema},
  output: {schema: AdjustBotDifficultyOutputSchema},
  prompt: `You are a game administrator adjusting the difficulty of a bot in a crypto quiz game.

You need to analyze the player win rate and adjust the bot difficulty accordingly to keep the game challenging and engaging.

Here's the current player win rate: {{playerWinRate}}%

Based on this win rate, determine the new bot difficulty. The difficulty can be one of: Easy, Medium, or Hard. Also, provide a short explanation of why you adjusted the bot difficulty.

Consider these factors:
- If the player win rate is very high (e.g., above 75%), the bot should be set to Hard to increase the challenge.
- If the player win rate is high (e.g., between 50% and 75%), the bot should be set to Medium.
- If the player win rate is low (e.g., below 50%), the bot should be set to Easy to make the game more accessible.
`,
});

const adjustBotDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustBotDifficultyFlow',
    inputSchema: AdjustBotDifficultyInputSchema,
    outputSchema: AdjustBotDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustBotDifficultyPrompt(input);
    return output!;
  }
);
