'use client'
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ModeToggle";
import { useState } from "react";
import Wallet from "./components/Wallet";

export default function Home() {
  const [blockchain, setBlockchain] = useState<string | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <ModeToggle />
      <h1 className="text-5xl mb-16">Add new Wallet</h1>
      {!blockchain && (
        <div className="flex items-center space-x-2">
        <Button className="w-36 h-12 text-xl  " onClick={() => setBlockchain("solana")} >Solana</Button>
        <Button className="w-36 h-12 text-xl  " onClick={() => setBlockchain("ethereum")} >Ethereum</Button>
      </div>
      )}
      {blockchain === "solana" && (
        <Wallet/>
      )}
    </main>
  );
}
