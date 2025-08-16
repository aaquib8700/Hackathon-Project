import { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";

export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [step, setStep] = useState("landing");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-atom text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Atom Wallet
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === "landing" && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-wallet text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to Atom Wallet</h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Create and manage your Solana wallets securely. Generate new wallets or check existing balances.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  const m = generateMnemonic();
                  setMnemonic(m);
                  setStep("showMnemonic");
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Generate New Wallet
              </button>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check"></i>
                  <span>No Data Stored</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "showMnemonic" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
              <h2 className="text-xl font-bold text-white text-center">Save Your Secret Phrase!</h2>
              <p className="text-amber-100 text-center text-sm mt-1">
                This is the only way to recover your wallet. Store it somewhere safe.
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {mnemonic.split(" ").map((word, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">{idx + 1}</div>
                    <div className="font-medium text-gray-900">{word}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                  {copied ? "Copied!" : "Copy Phrase"}
                </button>
                <button
                  onClick={() => setStep("wallet")}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                >
                  I've Saved My Phrase, Create Wallets
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "wallet" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep("landing")}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              <button
                onClick={() => setStep("checkBalance")}
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Check Balance
              </button>
            </div>
            
            <SolanaWallet mnemonic={mnemonic} />
          </div>
        )}

        {step === "checkBalance" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep("wallet")}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                Back to Wallets
              </button>
            </div>
            
            <SolanaWallet mnemonic={mnemonic} showBalance />
          </div>
        )}
      </main>
    </div>
  );
}