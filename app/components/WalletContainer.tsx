"use client";
import React from "react";
import { Button } from "@/components/ui/button";
// import { mnemonicToSeed } from 'bip39';
// import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { useState } from "react";
import Image from "next/image";
// import nacl from "tweetnacl"
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletCard from "./WalletCard";

interface Keys {
  publicKey: string;
  secretKey: string;
}

interface Props {
  selectedBlockchain: string;
  setSelectedBlockchain: (value: string) => void;
}

const WalletContainer = ({
  selectedBlockchain,
  setSelectedBlockchain,
}: Props) => {
  const [keys, setKeys] = useState<Keys | null>(null);

  async function generateSolanaWallet() {
    const keypair = Keypair.generate();

    console.log(" the keypair ", keypair);

    console.log(" the public key ", keypair.publicKey.toBase58());
    console.log(" the secret key ", bs58.encode(keypair.secretKey));

    setKeys({
      publicKey: keypair.publicKey.toBase58(),
      secretKey: bs58.encode(keypair.secretKey),
    });

    console.log(
      " decoded string ",
      bs58.decode(
        "5tgeYghN18XgzFrYYoxVVQj1ZHDD82Qcx6BjBFzFcuM6iQZBi2akqiiPT4p3uskSHwexchoy6PJANDunYths3Y1D"
      )
    );
    // console.log(" the secret key " )
  }
  return (
    <main className=" h-full w-full flex flex-col items-center gap-y-4">
      <h1 className="text-3xl ">Here are your wallets</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-2  w-44 rounded-lg h-12 cursor-pointer relative flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
    {selectedBlockchain === "Solana" && (
      <Image
        src="/solana.png"
        alt="Solana Logo"
        width={22}
        height={22}
      />
    )}
    {selectedBlockchain === "Ethereum" && (
      <Image
        src="/ethereum.png"
        alt="Ethereum Logo"
        width={22}
        height={22}
      />
    )}
    <span className="text-base">{selectedBlockchain}</span>
  </div>

  {/* Right: Chevron Icon */}
  <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem
            onClick={() => setSelectedBlockchain("Solana")}
            className="relative w-48 text-lg  flex justify-center cursor-pointer"
          >
            {" "}
            <Image
              src="/solana.png"
              className="absolute left-3"
              alt="Solana Logo"
              width={25}
              height={25}
            />{" "}
            Solana
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSelectedBlockchain("Ethereum")}
            className="relative w-48 text-lg flex justify-center cursor-pointer"
          >
            {" "}
            <Image
              src="/ethereum.png"
              className="absolute left-3"
              alt="Ethereum Logo"
              width={25}
              height={25}
            />
            Ethereum
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WalletCard
        index="1"
        publicKey="0x9B8101b81E7b1cfaA17Db24507CEC1298b6e63C2"
        secretKey="0xa827680f92cffa50d6ba8c9490bafd16ecea09bc7056afca567258b91b6715f6"
        balance="0"
        usdValue="0"
      />
      {/* {keys && (
            <div>
                <p> Public key:  {keys.publicKey}</p>
                <p> Secret key: {keys.secretKey}</p>
            </div>
        )}
        <Button onClick={generateSolanaWallet}>Generate Solana Wallet</Button> */}
    </main>
  );
};

export default WalletContainer;
