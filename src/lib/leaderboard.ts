export type LeaderboardEntry = {
  rank: number;
  player: string;
  wins: number;
  earnings: number;
};

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, player: "0xFastRacer", wins: 152, earnings: 76.0 },
  { rank: 2, player: "CryptoWhiz", wins: 148, earnings: 74.0 },
  { rank: 3, player: "SatoshiJr", wins: 130, earnings: 65.0 },
  { rank: 4, player: "EtherMind", wins: 125, earnings: 62.5 },
  { rank: 5, player: "BlockchainBoss", wins: 110, earnings: 55.0 },
  { rank: 6, player: "DeFiQueen", wins: 98, earnings: 49.0 },
  { rank: 7, player: "NFTrillionaire", wins: 95, earnings: 47.5 },
  { rank: 8, player: "AltcoinAce", wins: 88, earnings: 44.0 },
  { rank: 9, player: "HodlerHero", wins: 82, earnings: 41.0 },
  { rank: 10, player: "GaslessGamer", wins: 75, earnings: 37.5 },
];
