'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { leaderboardData, type LeaderboardEntry } from '@/lib/leaderboard';
import { Button } from '@/components/ui/button';

type LeaderboardProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline">Leaderboard</DialogTitle>
          <DialogDescription>
            Top players in the Crypto Mind Duel.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead className="text-right">Earnings ($MON)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry: LeaderboardEntry) => (
                <TableRow key={entry.rank}>
                  <TableCell className="font-medium">{entry.rank}</TableCell>
                  <TableCell>{entry.player}</TableCell>
                  <TableCell>{entry.wins}</TableCell>
                  <TableCell className="text-right">{entry.earnings.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
