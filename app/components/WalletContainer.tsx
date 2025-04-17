"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { HDNodeWallet, Wallet } from "ethers";
import { useState, useEffect } from "react";
import Image from "next/image";
import nacl from "tweetnacl";
import { Card } from "@/components/ui/card";
import SecretPhraseContainer from "./SecretPhraseContainer";
import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletCard from "./WalletCard";
import { toast } from "sonner";

interface Props {
  selectedBlockchain: string;
  setSelectedBlockchain: (value: string) => void;
  hasWallet: boolean;
}

interface Pouch {
  publicKey: string;
  secretKey: string;
  balance: number;
  usdValue: number;
}

const WalletContainer = ({
  selectedBlockchain,
  setSelectedBlockchain,
  hasWallet,
}: Props) => {
  const [solanaWallets, setSolanaWallets] = useState<Pouch[]>([]);
  const [ethereumWallets, setEthereumWallets] = useState<Pouch[]>([]);
  const [mnemonic, setMnemonic] = useState("");
  const [inputMode, setInputMode] = useState(false);
  const [isDevnet, setIsDevnet] = useState(true);

  async function generateSolanaWallet() {
    const seed = mnemonicToSeedSync(mnemonic);
    const index = solanaWallets.length;
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const secretKey = bs58.encode(secret);

    const url = isDevnet
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL_DEVNET
      : process.env.NEXT_PUBLIC_SOLANA_RPC_URL_MAINNET;

    if (!url) {
      throw new Error("Missing Solana RPC URL.");
    }
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [publicKey],
      }),
    });

    const data = await res.json();
    const balanceLamports = data.result.value;
    const balanceSOL = balanceLamports / 1e9;

    const usdRate = await getSolToUsdRate();

    const usdValue = (balanceSOL * usdRate).toFixed(2);

    setSolanaWallets((prevSolanaWallets) => [
      ...prevSolanaWallets,
      {
        publicKey,
        secretKey,
        balance: balanceSOL,
        usdValue: parseFloat(usdValue),
      },
    ]);
  }
  async function generateEthereumWallet() {
    const seed = mnemonicToSeedSync(mnemonic);
    const hdNode = HDNodeWallet.fromSeed(seed);
    const derivationPath = `m/44'/60'/${ethereumWallets.length}'/0'`;

    const child = hdNode.derivePath(derivationPath);

    const secretKey = child.privateKey;

    const wallet = new Wallet(secretKey);
    const publicKey = wallet.address;

    const url = isDevnet
      ? process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL_DEVNET
      : process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL_MAINNET;

    if (!url) {
      throw new Error("Missing Solana RPC URL.");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [publicKey, "latest"],
      }),
    });

    const data = await res.json();
    const balanceWei = parseInt(data.result, 16);
    const balanceETH = balanceWei / 1e18;

    const usdRate = await getEthToUsdRate();

    const usdValue = (balanceETH * usdRate).toFixed(2);

    setEthereumWallets((prevEthereumWallets) => [
      ...prevEthereumWallets,
      {
        publicKey,
        secretKey,
        balance: balanceETH,
        usdValue: parseFloat(usdValue),
      },
    ]);
  }

  function deleteSolanaWallet(walletIndex: number) {
    setSolanaWallets((prevsolanaWallets) =>
      prevsolanaWallets.filter((_, idx) => idx !== walletIndex)
    );
  }

  function deleteEthereumWallet(walletIndex: number) {
    setEthereumWallets((prevEthereumWallets) =>
      prevEthereumWallets.filter((_, idx) => idx !== walletIndex)
    );
  }

  function handleMnemonicChange(value: string) {
    setMnemonic(value);
  }

  const handleSave = () => {
    if (validateMnemonic(mnemonic)) {
      setInputMode(false);
      toast.success("Secret phrase saved!");
    } else {
      toast.error("Invalid secret phrase!");
    }
  };

  const getSolToUsdRate = async (): Promise<number> => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data = await res.json();
      const solPriceInUsd = data.solana.usd;
      return solPriceInUsd;
    } catch (error) {
      console.error("Error fetching SOL to USD rate:", error);
      return 0;
    }
  };

  const getEthToUsdRate = async (): Promise<number> => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      const ethPriceInUsd = data.ethereum.usd;
      return ethPriceInUsd;
    } catch (error) {
      console.error("Error fetching ETH to USD rate:", error);
      return 0;
    }
  };

  useEffect(() => {
    if (!hasWallet) {
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
      setInputMode(false);
    } else {
      setInputMode(true);
    }
  }, [hasWallet]);

  return (
    <main className="h-full w-full flex flex-col items-center gap-y-4 px-4 md:px-8">
      <SecretPhraseContainer
        mnemonic={mnemonic}
        onChange={inputMode ? handleMnemonicChange : undefined}
        onSave={handleSave}
      />
      <h1 className="text-3xl mt-16">Here are your Wallets</h1>
      <div className="flex flex-col md:flex-row justify-center w-full items-center gap-4 relative mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="border-2 w-full md:w-44 rounded-lg h-12 cursor-pointer relative flex items-center justify-between px-4">
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
          className="w-full md:w-32 h-12 text-md "
          onClick={
            selectedBlockchain === "Solana"
              ? generateSolanaWallet
              : generateEthereumWallet
          }
        >
          Add Wallet
        </Button>
        <Card className="flex items-center gap-4 p-4 w-full md:w-60  ">
          <div className="flex flex-col w-full px-4">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="devnet-toggle"
                className="text-base font-semibold"
              >
                {isDevnet ? "Devnet" : "Mainnet"}
              </Label>
              <Switch
                id="devnet-toggle"
                checked={isDevnet}
                onCheckedChange={(checked) => {
                  setIsDevnet(checked);
                  setSolanaWallets([]);
                  setEthereumWallets([]);
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {isDevnet ? "Connected to Devnet" : "Connected to Mainnet"}
            </p>
          </div>
        </Card>
      </div>

      {selectedBlockchain === "Solana" && solanaWallets.length === 0 && (
        <h2 className="text-lg mt-8 text-muted-foreground font-mono">
          You have no Solana Wallets. Please add one
        </h2>
      )}
      {selectedBlockchain === "Ethereum" && ethereumWallets.length === 0 && (
        <h2 className="text-lg mt-8 text-muted-foreground font-mono">
          You have no Ethereum Wallets. Please add one
        </h2>
      )}
      {selectedBlockchain === "Solana"
        ? solanaWallets.map((wallet, index) => (
            <WalletCard
              key={wallet.publicKey}
              index={index}
              publicKey={wallet.publicKey}
              secretKey={wallet.secretKey}
              balance={wallet.balance}
              usdValue={wallet.usdValue}
              onDelete={deleteSolanaWallet}
            />
          ))
        : ethereumWallets.map((wallet, index) => (
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
