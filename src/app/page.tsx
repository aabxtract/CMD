import GameClient from "@/app/GameClient";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <GameClient />
    </main>
  );
}
