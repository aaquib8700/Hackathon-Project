// 

import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [walletaddress, setwalletaddress] = useState([]);

    const [searchAddress,setsearchAddress]=useState("");
    const [WalletBalance,setWalletBalance]=useState(null);

    const FetchBalance=async(publicKey)=>{
        const response=await fetch("https://api.devnet.solana.com",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                jsonrpc:"2.0",
                id:1,
                method:"getBalance",
                params:[publicKey]
            })
        })
        const Data=await response.json();
        return Data.result.value/1_000_000_000;
    }

    return <div>
        <button onClick={async function() {
            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setwalletaddress([...walletaddress, keypair.publicKey]);
        }}>
            Add SOL wallet
        </button>
        {walletaddress.map((w,i) => <div key={i}>
           Wallet{i+1}: {w.toBase58()}
        </div>)}

        <hr />
        <h3>Check Balance of your Wallet</h3>
        <input type="text" value={searchAddress} onChange={(e)=>setsearchAddress(e.target.value)} />
        <button onClick={async()=>{
            if(!searchAddress){
                alert("Please enter your Wallet address");
                return;
            }
            const Balance=await FetchBalance(searchAddress);
            setWalletBalance(Balance);
        }}>Check Balance</button>
        {WalletBalance !==null && (
            <div>
                Balance:{WalletBalance} Sol
            </div>
        )}
    </div>
}