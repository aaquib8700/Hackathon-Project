import { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";

export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [step, setStep] = useState("landing"); 

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    alert("Seed phrase copied!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {step === "landing" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Solana Wallet</h1>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            onClick={() => {
              const m = generateMnemonic();
              setMnemonic(m);
              setStep("showMnemonic");
            }}
          >
            Create Wallet
          </button>
        </div>
      )}

      {step === "showMnemonic" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-3">Your Recovery Phrase</h2>
          <p className="bg-gray-100 border rounded-xl p-4 text-sm text-gray-700 mb-4">
            {mnemonic}
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
              onClick={handleCopy}
            >
              Copy
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              onClick={() => setStep("wallet")}
            >
              I have saved
            </button>
          </div>
        </div>
      )}

      {step === "wallet" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
          <div className="flex justify-between mb-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => setStep("landing")}
            >
              Go Back
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setStep("checkBalance")}
            >
              Check Wallet Balance
            </button>
          </div>
          <SolanaWallet mnemonic={mnemonic} />
        </div>
      )}

      {step === "checkBalance" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
          <div className="flex justify-between mb-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => setStep("wallet")}
            >
              Go Back
            </button>
          </div>
          <SolanaWallet mnemonic={mnemonic} showBalance />
        </div>
      )}
    </div>
  );
}