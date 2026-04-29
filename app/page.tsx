// Updated standalone version - April 29
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, Wallet } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  price: 2450 + Math.random() * 150,
}));

export default function ArcTradingApp() {
  const [price, setPrice] = useState(2456.78);
  const [amount, setAmount] = useState(100);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const creator = "0x2EdBe6602e8caE94ff9d3f7013Ddf78442813a5f";

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => Math.max(2300, p + (Math.random() - 0.5) * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const executeTrade = () => {
    toast.success(`${side.toUpperCase()} ${amount} USDC`, {
      description: "✅ Trade executed on Arc Testnet",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-center" />

      <header className="bg-zinc-950 border-b border-cyan-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold">A</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Arc Trade</h1>
              <p className="text-cyan-400 text-sm -mt-1">Simple Trading</p>
            </div>
          </div>
          <div className="text-sm text-cyan-400">Arc Testnet</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-zinc-900 border border-cyan-500/30 rounded-full px-6 py-3">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <span>Created by {creator.slice(0,6)}...{creator.slice(-4)}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Area */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-6xl font-mono font-bold">${price.toFixed(2)}</div>
                <div className="flex items-center gap-2 text-emerald-400 mt-2">
                  <ArrowUp className="w-6 h-6" /> +2.34% (24h)
                </div>
              </div>
              <div className="text-2xl text-zinc-400">USDC / ETH</div>
            </div>

            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={mockChartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="natural" dataKey="price" stroke="#22d3ee" strokeWidth={5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Panel */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 flex flex-col">
            <h2 className="text-3xl font-semibold mb-10">Instant Trade</h2>

            <div className="flex gap-4 mb-12">
              <button onClick={() => setSide('buy')} className={`flex-1 py-6 rounded-2xl font-bold text-xl ${side === 'buy' ? 'bg-emerald-500 text-black' : 'bg-zinc-900'}`}>BUY</button>
              <button onClick={() => setSide('sell')} className={`flex-1 py-6 rounded-2xl font-bold text-xl ${side === 'sell' ? 'bg-red-500' : 'bg-zinc-900'}`}>SELL</button>
            </div>

            <div className="mb-12">
              <label className="block text-zinc-400 mb-4 text-lg">Amount (USDC)</label>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="text-center text-7xl font-mono font-bold mt-8">{amount}</div>
            </div>

            <button
              onClick={executeTrade}
              className="w-full py-8 rounded-3xl text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-black mt-auto"
            >
              {side === 'buy' ? 'BUY NOW' : 'SELL NOW'}
            </button>

            <p className="text-center text-xs text-zinc-500 mt-8">Super low fees • Instant on Arc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
Force update for Vercel
