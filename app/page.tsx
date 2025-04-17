"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ModeToggle";
import { useState } from "react";
import WalletContainer from "./components/WalletContainer";
import Image from "next/image";

export default function Home() {
  const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 ">
      <div className="self-end p-4">
        <ModeToggle />
      </div>

      <div className="flex flex-col md:min-h-[80vh] items-center border-2 border-border rounded-3xl my-4 w-full max-w-3xl p-6">
        <h1 className="text-4xl md:text-5xl mb-8 mt-12 text-center">Welcome to Pouch</h1>

        {hasWallet === null && (
          <div className="w-full flex flex-col gap-6 justify-center items-center mt-16">
            <Button
              variant="custom"
              className="w-full max-w-xs h-20 text-lg"
              onClick={() => setHasWallet(false)}
            >
              Create a new wallet
            </Button>
            <Button
              variant="custom"
              className="w-full max-w-xs h-20 text-lg"
              onClick={() => setHasWallet(true)}
            >
              I already have a wallet
            </Button>
          </div>
        )}

        {hasWallet !== null && !selectedBlockchain && (
          <>
            <h2 className="text-2xl md:text-3xl my-8 text-center">
              Please Select a Blockchain to continue
            </h2>
            <div className="flex flex-col gap-6 items-center w-full">
              <Button
                variant="custom"
                className="w-full max-w-xs h-20 relative text-lg"
                onClick={() => setSelectedBlockchain("Solana")}
              >
                <Image
                  src="/solana.png"
                  className="absolute left-4"
                  alt="Solana Logo"
                  width={32}
                  height={32}
                />
                Solana
              </Button>
              <Button
                variant="custom"
                className="w-full max-w-xs h-20 relative text-lg"
                onClick={() => setSelectedBlockchain("Ethereum")}
              >
                <Image
                  src="/ethereum.png"
                  className="absolute left-4"
                  alt="Ethereum Logo"
                  width={32}
                  height={32}
                />
                Ethereum
              </Button>
            </div>
          </>
        )}

        {hasWallet !== null && selectedBlockchain && (
          <WalletContainer
            selectedBlockchain={selectedBlockchain}
            setSelectedBlockchain={setSelectedBlockchain}
            hasWallet={hasWallet}
          />
        )}
      </div>
    </main>
  );
}
