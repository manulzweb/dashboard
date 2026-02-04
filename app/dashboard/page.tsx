'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import BalanceTable from '@/components/BalanceTable';
import PortfolioChart from '@/components/PortfolioChart';
import AllocationDonut from '@/components/AllocationDonut';
import { Balance } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { DollarSign, Zap } from 'lucide-react';

export default function DashboardPage() {
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<Balance | null>(null);
    const [totalEquity, setTotalEquity] = useState(0);
    const router = useRouter();

    const fetchBalances = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Balances
            const res = await fetch('/api/bitunix/balance');
            if (res.status === 401) {
                router.push('/login');
                return;
            }

            const responseData = await res.json();
            if (responseData.code !== 0 && responseData.code !== 200 && responseData.code !== '0') {
                throw new Error(responseData.msg || 'Unknown API Error');
            }

            let rawAssets: any[] = responseData.data || [];
            if (!Array.isArray(rawAssets)) rawAssets = [];

            // 2. Filter out tiny balances to reduce API calls
            const significantAssets = rawAssets.filter((item: any) =>
                parseFloat(item.balance) > 0 || parseFloat(item.balanceLocked) > 0
            );

            // 3. Fetch Prices for each asset
            const enrichedAssets: Balance[] = await Promise.all(significantAssets.map(async (item: any) => {
                const currency = item.coin;
                const available = parseFloat(item.balance);
                const frozen = parseFloat(item.balanceLocked);
                const totalAmount = available + frozen;

                let usdtPrice = 0;

                // Assume USDT has price 1
                if (currency === 'USDT') {
                    usdtPrice = 1;
                } else {
                    try {
                        const priceRes = await fetch(`/api/bitunix/last-price?symbol=${currency}USDT`);
                        const priceData = await priceRes.json();
                        // Depending on Bitunix structure: { code: 0, data: { price: "..." } } or similar
                        // The user provided structure earlier was { "code": "0", "data": { ... } }
                        // Let's being robust
                        if (priceData.data && priceData.data.price) {
                            usdtPrice = parseFloat(priceData.data.price);
                        } else if (priceData.data && typeof priceData.data === 'string') {
                            usdtPrice = parseFloat(priceData.data);
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch price for ${currency}`);
                    }
                }

                const usdtValue = (totalAmount * usdtPrice).toFixed(2);

                return {
                    currency: item.coin,
                    available: item.balance,
                    frozen: item.balanceLocked,
                    btcValue: '0',
                    usdtValue: usdtValue
                };
            }));

            // Sort by value desc
            enrichedAssets.sort((a, b) => parseFloat(b.usdtValue) - parseFloat(a.usdtValue));

            setBalances(enrichedAssets);

            // Calculate Total
            const total = enrichedAssets.reduce((acc, curr) => acc + parseFloat(curr.usdtValue), 0);
            setTotalEquity(total);

        } catch (err: any) {
            console.error('[Dashboard] Fetch Error:', err);
            setError(err.message || 'Failed to sync data');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchBalances();
    }, [fetchBalances]);

    return (
        <div className="min-h-screen bg-[#050507] text-gray-100 font-sans selection:bg-[#00f3ff] selection:text-black">
            <Navbar />

            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Ambient Background Glows */}
            <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-[#bd00ff]/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="fixed bottom-20 right-1/4 w-[500px] h-[500px] bg-[#00f3ff]/10 rounded-full blur-[128px] pointer-events-none"></div>

            <main className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-1 w-12 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"></div>
                            <span className="text-[#00f3ff] font-mono text-xs tracking-widest uppercase">My Portfolio</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase glitch-text">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-gray-400 font-mono text-sm">
                            <span className="text-[#00f3ff]">LIVE</span>
                            <span className="animate-pulse mx-2">●</span>
                            Connecting to Bitunix Mainnet
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono block mb-1">Total Net Worth</span>
                        <div className="relative inline-block group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative text-6xl font-black text-white flex items-center justify-end gap-2 bg-clip-text">
                                <span className="text-3xl text-gray-500 mt-2">$</span>
                                {totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <PortfolioChart selectedAsset={selectedAsset} />
                    </div>
                    <div className="lg:col-span-1">
                        <AllocationDonut balances={balances} onSelect={(asset: any) => setSelectedAsset(asset)} />
                    </div>
                </div>

                {/* Assets Table */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-[#bd00ff]" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Active Assets</h2>
                    </div>
                    <BalanceTable
                        balances={balances}
                        loading={loading}
                        onRefresh={fetchBalances}
                        error={error}
                        // @ts-ignore
                        onSelectAsset={(asset) => setSelectedAsset(asset)} // Pass handler
                        selectedCurrency={selectedAsset?.currency}
                    />
                </div>
            </main>
        </div>
    );
}
