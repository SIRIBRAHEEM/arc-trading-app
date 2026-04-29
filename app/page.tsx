'use client';

import { useState, useEffect } from 'react';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, arcTestnet } from '../lib/arc';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, Wallet, TrendingUp } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const queryClient = new QueryClient();

const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  price: 2400 + Math.random() * 200 - 50,
}));

export default function ArcTradingApp() {
  const [price, setPrice] = useState(2456.78);
  const [change, setChange] = useState(2.34);
  const [amount, setAmount] = useState(100);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const creator = "0x2EdBe6602e8caE94ff9d3f7013Ddf78442813a5f";

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => p + (Math.random() - 0.5) * 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const executeTrade = () => {
    toast.success(`${side.toUpperCase()} ${amount} USDC executed on Arc Testnet!`, {
      description: `Tx: 0x${Math.random().toString(16).slice(2)}...`,
    });
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-black text-white">
            <Toaster position="top-center" />

            {/* Header */}
            <header className="border-b border-cyan-900/50 glass sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold">A</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Arc Trade</h1>
                    <p className="text-xs text-cyan-400">Simple • Fast • On Arc</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs px-3 py-1.5 bg-zinc-900 rounded-full border border-cyan-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Arc Testnet
                  </div>
                  <ConnectButton />
                </div>
              </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Creator Badge */}
              <div className="mb-6 flex justify-center">
                <div className="px-4 py-2 bg-zinc-900/80 border border-cyan-500/30 rounded-2xl text-sm flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  Powered by <span className="font-mono text-cyan-400">{creator.slice(0,6)}...{creator.slice(-4)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 glass rounded-3xl p-6">
                  <div className="flex justify-between mb-6">
                    <div>
                      <div className="text-4xl font-semibold tabular-nums">{price.toFixed(2)} <span className="text-lg text-zinc-400">USDC</span></div>
                      <div className={`flex items-center gap-1 ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {change.toFixed(2)}% (24h)
                      </div>
                    </div>
                    <div className="text-right text-sm text-zinc-400">
                      USDC / ETH
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={420}>
                    <LineChart data={mockChartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="natural" dataKey="price" stroke="#00f5ff" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Trade Panel */}
                <div className="glass rounded-3xl p-8 flex flex-col">
                  <h2 className="text-2xl font-semibold mb-8">Instant Trade</h2>

                  <div className="flex gap-2 mb-8">
                    <button onClick={() => setSide('buy')} className={`flex-1 py-4 rounded-2xl font-semibold ${side === 'buy' ? 'bg-emerald-500 text-black' : 'bg-zinc-900'}`}>BUY</button>
                    <button onClick={() => setSide('sell')} className={`flex-1 py-4 rounded-2xl font-semibold ${side === 'sell' ? 'bg-red-500 text-white' : 'bg-zinc-900'}`}>SELL</button>
                  </div>

                  <div className="space-y-8 flex-1">
                    <div>
                      <label className="text-sm text-zinc-400 block mb-2">Amount (USDC)</label>
                      <input
                        type="range"
                        min="10"
                        max="10000"
                        step="10"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                      <div className="text-5xl font-mono font-semibold mt-4 tabular-nums">{amount}</div>
                    </div>

                    <button
                      onClick={executeTrade}
                      className="w-full py-6 text-xl font-bold rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:scale-105 transition-transform"
                    >
                      {side === 'buy' ? 'BUY NOW' : 'SELL NOW'}
                    </button>
                  </div>

                  <div className="text-center text-xs text-zinc-500 mt-auto pt-8">
                    Gas fee ≈ $0.0001 • Instant settlement on Arc
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
