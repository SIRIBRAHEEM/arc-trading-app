'use client';

import { useState, useEffect } from 'react';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, Wallet } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const queryClient = new QueryClient();

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
  blockExplorers: { default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' } },
} as const;

const config = getDefaultConfig({
  appName: 'Arc Simple Trade',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [arcTestnet],
  ssr: true,
});

const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  price: 2450 + Math.random() * 150,
}));

export default function ArcTradingApp() {
  const [price, setPrice] = useState(2456.78);
  const [change] = useState(2.34);
  const [amount, setAmount] = useState(100);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const creator = "0x2EdBe6602e8caE94ff9d3f7013Ddf78442813a5f";

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => Math.max(2300, p + (Math.random() - 0.5) * 8));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const executeTrade = () => {
    toast.success(`${side.toUpperCase()} ${amount} USDC on Arc Testnet!`, {
      description: "Transaction successful 🎉",
    });
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-black text-white">
            <Toaster position="top-center" />

            <header className="border-b border-cyan-900/50 bg-zinc-950 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold">A</div>
                  <div>
                    <h1 className="text-3xl font-bold">Arc Trade</h1>
                    <p className="text-cyan-400 text-sm">Simple • Beautiful • On Arc</p>
                  </div>
                </div>
                <ConnectButton />
              </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-cyan-500/30 px-5 py-2 rounded-full text-sm">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  Created by {creator.slice(0,6)}...{creator.slice(-4)}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
                  <div className="flex justify-between mb-8">
                    <div>
                      <div className="text-5xl font-mono font-semibold">${price.toFixed(2)}</div>
                      <div className="flex items-center gap-1 text-emerald-400 mt-1">
                        <ArrowUp className="w-5 h-5" /> +{change}% (24h)
                      </div>
                    </div>
                    <div className="text-xl">USDC / ETH</div>
                  </div>

                  <ResponsiveContainer width="100%" height={420}>
                    <LineChart data={mockChartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="natural" dataKey="price" stroke="#22d3ee" strokeWidth={4} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 flex flex-col">
                  <h2 className="text-3xl font-semibold mb-8">Instant Trade</h2>

                  <div className="flex gap-3 mb-10">
                    <button 
                      onClick={() => setSide('buy')} 
                      className={`flex-1 py-5 rounded-2xl font-bold text-lg ${side === 'buy' ? 'bg-emerald-500 text-black' : 'bg-zinc-900'}`}
                    >
                      BUY
                    </button>
                    <button 
                      onClick={() => setSide('sell')} 
                      className={`flex-1 py-5 rounded-2xl font-bold text-lg ${side === 'sell' ? 'bg-red-500 text-white' : 'bg-zinc-900'}`}
                    >
                      SELL
                    </button>
                  </div>

                  <div>
                    <div className="text-zinc-400 mb-3">Amount (USDC)</div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="text-6xl font-mono font-bold mt-6 text-center">{amount}</div>
                  </div>

                  <button
                    onClick={executeTrade}
                    className="mt-auto w-full py-7 rounded-3xl text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:brightness-110"
                  >
                    {side === 'buy' ? 'BUY NOW' : 'SELL NOW'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
