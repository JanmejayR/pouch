'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
// import { mnemonicToSeed } from 'bip39';
// import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { useState } from 'react';
// import nacl from "tweetnacl"

interface Keys{
    publicKey: string,
    secretKey: string
}
const Wallet = () => {

    const [keys, setKeys] = useState<Keys | null>(null);

    async function generateSolanaWallet() {
        const keypair = Keypair.generate(); 

        console.log(" the keypair " , keypair);

        console.log(" the public key " , keypair.publicKey.toBase58()); 
        console.log(" the secret key " , bs58.encode(keypair.secretKey)); 

        setKeys({
            publicKey: keypair.publicKey.toBase58(),
            secretKey: bs58.encode(keypair.secretKey)
        })

        
        console.log(" decoded string " , bs58.decode('5tgeYghN18XgzFrYYoxVVQj1ZHDD82Qcx6BjBFzFcuM6iQZBi2akqiiPT4p3uskSHwexchoy6PJANDunYths3Y1D'))
        // console.log(" the secret key " )


    }
  return (
    <div>
        {keys && (
            <div>
                <p> Public key:  {keys.publicKey}</p>
                <p> Secret key: {keys.secretKey}</p>
            </div>
        )}
        <Button onClick={generateSolanaWallet}>Generate Solana Wallet</Button>
    </div>
  )
}

export default Wallet