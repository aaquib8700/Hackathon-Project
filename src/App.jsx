import { useState } from 'react'
import { generateMnemonic } from 'bip39'
import { SolanaWallet } from './SolanaWallet';

export default function App() {
  const[mnemonic,setmnemonic]=useState("");
  return (
    <>
    <input type="text" value={mnemonic} />
    <button onClick={async ()=>{
      const m= generateMnemonic();
      setmnemonic(m);
    }}>Create seed phrase</button>
    {mnemonic && <SolanaWallet mnemonic={mnemonic}/>}
    </>
  )
}
