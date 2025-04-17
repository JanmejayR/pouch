"use client";
import React from "react";
import { Button } from "@/components/ui/button";
// import { mnemonicToSeed } from 'bip39';
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { HDNodeWallet , Wallet } from "ethers";
import { useState, useEffect } from "react";
import Image from "next/image";
import nacl from "tweetnacl";
import SecretPhraseContainer from "./SecretPhraseContainer";
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

interface Props {
  selectedBlockchain: string;
  setSelectedBlockchain: (value: string) => void;
  hasWallet : boolean;
}

interface Pouch {
  publicKey: string;
  secretKey: string;
  balance: string;
  usdValue: string;
}

const WalletContainer = ({
  selectedBlockchain,
  setSelectedBlockchain,
  hasWallet
}: Props) => {
  const [solanaWallets, setSolanaWallets] = useState<Pouch[]>([]);
  const [ethereumWallets, setEthereumWallets] = useState<Pouch[]>([]);
  const [mnemonic, setMnemonic] = useState("");
  const [inputMode, setInputMode] = useState(false);

  async function generateSolanaWallet() {
    const seed = mnemonicToSeedSync(mnemonic);
    const index = solanaWallets.length;
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const secretKey = bs58.encode(secret);

    setSolanaWallets((prevSolanaWallets) => [
      ...prevSolanaWallets,
      { publicKey, secretKey, balance: "0", usdValue: "0" },
    ]);
  }
  function generateEthereumWallet(){
    const seed = mnemonicToSeedSync(mnemonic);

    const hdNode = HDNodeWallet.fromSeed(seed);
    const derivationPath = `m/44'/60'/${ethereumWallets.length}'/0`;
    const child = hdNode.derivePath(derivationPath);

    const secretKey = child.privateKey;

    const wallet = new Wallet(secretKey)
    const publicKey = wallet.address;

    setEthereumWallets((prevEthereumWallets) => [
      ...prevEthereumWallets,
      { publicKey, secretKey, balance: "0", usdValue: "0" },
    ]);
  }

  function deleteSolanaWallet(walletIndex: number) {
    console.log(" in delete ", walletIndex);
    setSolanaWallets((prevsolanaWallets) =>
      prevsolanaWallets.filter((_, idx) => idx !== walletIndex)
    );
  }

  function deleteEthereumWallet(walletIndex: number) {
    console.log(" in delete ", walletIndex);
    setEthereumWallets((prevEthereumWallets) =>
      prevEthereumWallets.filter((_, idx) => idx !== walletIndex)
    );
  }

  function handleMnemonicChange(value: string) {
    setMnemonic(value);
  }
  
  useEffect(() => {
    if (!hasWallet) {
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
      setInputMode(false);
    } else {
      setInputMode(true);  
    }
  }, []);

  return (
    <main className=" h-full w-full flex flex-col items-center gap-y-4">
      <SecretPhraseContainer mnemonic={mnemonic} onChange={inputMode ? handleMnemonicChange : undefined} />
      <h1 className="text-3xl mt-16">Here are your Wallets</h1>
      <div className="flex justify-center w-full items-center relative   ">
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

        <Button
          variant="custom"
          className="w-32 h-12 text-md absolute right-16 "
          onClick={selectedBlockchain === "Solana" ? generateSolanaWallet : generateEthereumWallet}
        >
          Add Wallet
        </Button>
      </div>

      { selectedBlockchain === "Solana" && solanaWallets.length === 0 && (
        <h2 className="text-lg mt-8 text-muted-foreground font-mono">
          You have no Solana Wallets. Please add one
        </h2>
      )}
      { selectedBlockchain === "Ethereum" && ethereumWallets.length === 0 && (
        <h2 className="text-lg mt-8 text-muted-foreground font-mono">
          You have no Ethereum Wallets. Please add one
        </h2>
      )}
      {selectedBlockchain === "Solana" ? solanaWallets.map((wallet, index) => (
        <WalletCard
          key={wallet.publicKey}
          index={index}
          publicKey={wallet.publicKey}
          secretKey={wallet.secretKey}
          balance={wallet.balance}
          usdValue={wallet.usdValue}
          onDelete={deleteSolanaWallet}
        />
      )) : ethereumWallets.map((wallet, index) => (
        <WalletCard
          key={wallet.publicKey}
          index={index}
          publicKey={wallet.publicKey}
          secretKey={wallet.secretKey}
          balance={wallet.balance}
          usdValue={wallet.usdValue}
          onDelete={deleteEthereumWallet}
        />
      ))}
    </main>
  );
};

export default WalletContainer;
