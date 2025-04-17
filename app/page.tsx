"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ModeToggle";
import { useState } from "react";
import WalletContainer from "./components/WalletContainer";
import Image from "next/image";

export default function Home() {
  const [selectedBlockchain, setselectedBlockchain] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  return (
    <main className=" min-h-screen flex justify-center  ">
      <ModeToggle />
      <div className="flex flex-col items-center border-2 border-border rounded-3xl my-4  lg:w-[48rem]">
        <h1 className="text-5xl mb-8 mt-16">Welcome to Pouch</h1>
      
      
      {hasWallet === null && (
        <div className="w-full flex flex-col gap-y-5 justify-center items-center mt-24">
        <Button variant="custom" className="w-96 h-24" onClick={()=>setHasWallet(false)}>Create a new wallet</Button>
        <Button variant="custom" className="w-96 h-24" onClick={()=>setHasWallet(true)}>I already have a wallet</Button>
        </div>
      )}
        
        { hasWallet !== null && !selectedBlockchain && (

          <><h2 className="text-3xl my-8">
          Please Select a Blockchain to continue
        </h2>
          <div className="flex flex-col items-center space-y-4 ">
            <Button
              variant="custom"
              className="w-96 h-24  relative"
              onClick={() => setselectedBlockchain("Solana")}
            >
             
                <Image
                src="/solana.png"
                className="absolute left-6"
                alt="Solana Logo"
                width={40}
                height={40}
              />
              Solana{" "}
             
            </Button>
            <Button
              variant="custom"
              className="w-96 h-24  relative"
              onClick={() => setselectedBlockchain("Ethereum")}
            >
              {" "}
              <Image
                src="/ethereum.png"
                className="absolute left-6"
                alt="Ethereum Logo"
                width={40}
                height={40}
              />{" "}
              Ethereum
            </Button>
          </div>
          </>
        )}
        { hasWallet !== null && selectedBlockchain && <WalletContainer selectedBlockchain={selectedBlockchain} setSelectedBlockchain={setselectedBlockchain} hasWallet={hasWallet} />}


      </div>
    </main>
  );
}
