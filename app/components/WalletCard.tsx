"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Copy , Trash2 } from "lucide-react";
import Image from "next/image";

interface Props {
  index: number;
  publicKey: string;
  secretKey: string;
  balance: number; 
  usdValue: number; 
  onDelete : ( walletIndex: number ) => void
}

const WalletCard = ({
  index ,
  publicKey = "",
  secretKey = "",
  balance = 0,
  usdValue = 0,
  onDelete
}: Props) => {
  const [showSecret, setShowSecret] = useState(false);

  const isETH = publicKey.startsWith("0x");
  const currency = isETH ? "ETH" : "SOL";
  const logo = isETH ? "/ethereum.png" : "/solana.png";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <Card className="w-full max-w-[40rem] shadow-md relative my-4 px-4">
      <CardHeader>
        <CardTitle className="text-2xl">Wallet {index+1}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 ">
            <Trash2 className="absolute top-6 right-9 cursor-pointer  hover:text-red-500" height={20} width={20} onClick={()=>onDelete(index)} />

         
        <div className="flex flex-col sm:flex-row justify-between gap-4 px-2">
          <div className="flex  items-center gap-2  ">
            <Image src={logo} alt={currency} width={40} height={40} />
            <div className="flex flex-col  justify-center">
            <span className=" text-xl pt-1">{currency === "ETH" ? "Ethereum" : "Solana"}</span>
            <div >
            <p className="text-md  text-muted-foreground font-medium ">{balance} {currency}</p>
            </div>
            </div>
          </div>

          <div className="flex justify-start sm:justify-between items-center mt-2 sm:mt-0">
            
            <span className="text-muted-foreground font-medium text-2xl">${usdValue}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
  <div className="font-medium">Public Key:</div>
  <div className="flex items-start gap-2">
    <span className="w-full break-all text-muted-foreground font-mono whitespace-pre-wrap">
      {publicKey}
    </span>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleCopy(publicKey, "Public key")}
    >
      <Copy className="h-4 w-4" />
    </Button>
  </div>
</div>


<div className="flex flex-col gap-1">
  <div className="font-medium">Secret Key:</div>
  <div className="flex items-start gap-2">
    <span
      className="w-full break-words break-all text-muted-foreground font-mono whitespace-pre-wrap cursor-pointer hover:opacity-80 transition"
      onClick={() => showSecret && handleCopy(secretKey, "Secret key")}
      title={showSecret ? "Click to copy" : ""}
    >
      {showSecret ? secretKey : "•".repeat(secretKey.length)}
    </span>
    
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowSecret((prev) => !prev)}
    >
      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </div>
</div>


        
      </CardContent>
    </Card>
  );
};

export default WalletCard;
