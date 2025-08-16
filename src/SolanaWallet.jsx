import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";

export function SolanaWallet({ mnemonic, showBalance }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [privatekey, setprivatekey] = useState([]);
  const [showPrivateKeys, setShowPrivateKeys] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);

  const fetchBalance = async (publicKey) => {
    const response = await fetch("https://solana-mainnet.g.alchemy.com/v2/2UT-VpKMOTi3x725BAVQM", {
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
    setIsLoading(true);
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      console.log("Privatekey", bs58.encode(secret));
      
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex((prev) => prev + 1);
      setWallets([...wallets, keypair.publicKey.toBase58()]);
      setprivatekey([...privatekey, secret]);
    } catch (error) {
      console.error("Error generating wallet:", error);
      alert("Error generating wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePrivateKeyVisibility = (index) => {
    setShowPrivateKeys(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!showBalance) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <button
            onClick={handleAddWallet}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <i className="fas fa-plus"></i>
            )}
            {isLoading ? "Generating..." : "Add SOL Wallet"}
          </button>
        </div>

        {wallets.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Wallets</h3>
            {wallets.map((wallet, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Account {i + 1}</h4>
                  <span className="text-sm text-gray-500">m/44'/501'/{i}'/0'</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Public Key / Address
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="flex-1 text-sm font-mono text-gray-800 break-all">
                        {wallet}
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Private Key
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="flex-1 text-sm font-mono text-gray-800 break-all">
                        {showPrivateKeys[i] ? bs58.encode(privatekey[i]) : "•".repeat(40)}
                      </span>
                      <button
                        onClick={() => togglePrivateKeyVisibility(i)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className={`fas ${showPrivateKeys[i] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                      {showPrivateKeys[i] && (
                        <button
                          onClick={() => copyToClipboard(bs58.encode(privatekey[i]))}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <i className="fas fa-wallet text-5xl text-blue-500 mb-3"></i>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Wallet Balance</h3>
        <p className="text-gray-600 text-sm">Enter a Solana wallet address to check its balance</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Enter your wallet address..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-mono"
          />
        </div>

        <button
          onClick={async () => {
            if (!searchAddress) {
              alert("Please enter your Wallet address");
              return;
            }
            setIsCheckingBalance(true);
            try {
              const balance = await fetchBalance(searchAddress);
              setWalletBalance(balance);
            } catch (error) {
              console.error("Error fetching balance:", error);
              alert("Error fetching balance. Please check the address and try again.");
            } finally {
              setIsCheckingBalance(false);
            }
          }}
          disabled={isCheckingBalance || !searchAddress}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingBalance ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Checking Balance...
            </div>
          ) : (
            "Check Balance"
          )}
        </button>

        {walletBalance !== null && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-green-600"></i>
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Current Balance</p>
                <p className="text-2xl font-bold text-green-800">{walletBalance.toFixed(4)} SOL</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}