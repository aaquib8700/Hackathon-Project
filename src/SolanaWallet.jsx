import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic, showBalance }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  const fetchBalance = async (publicKey) => {
    const response = await fetch("https://api.devnet.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [publicKey],
      }),
    });
    const data = await response.json();
    return data.result.value / 1_000_000_000;
  };

  const handleAddWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setWallets([...wallets, keypair.publicKey.toBase58()]);
  };

  return (
    <div className="text-left">
      {!showBalance && (
        <div>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleAddWallet}
          >
            Add SOL Wallet
          </button>
          {wallets.map((w, i) => (
            <div
              key={i}
              className="mt-2 p-2 bg-gray-100 rounded-md text-sm break-words"
            >
              Wallet {i + 1}: {w}
            </div>
          ))}
        </div>
      )}

      {showBalance && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Check Balance</h3>
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="border p-2 w-full rounded-md mb-2"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={async () => {
              if (!searchAddress) {
                alert("Please enter your Wallet address");
                return;
              }
              const balance = await fetchBalance(searchAddress);
              setWalletBalance(balance);
            }}
          >
            Check Balance
          </button>
          {walletBalance !== null && (
            <div className="mt-3 p-2 bg-gray-100 rounded-md">
              Balance: {walletBalance} SOL
            </div>
          )}
        </div>
      )}
    </div>
  );
}