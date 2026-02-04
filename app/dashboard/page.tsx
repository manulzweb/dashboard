'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import BalanceTable from '@/components/BalanceTable';
import PortfolioChart from '@/components/PortfolioChart';
import AllocationDonut from '@/components/AllocationDonut';
import { Balance } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { DollarSign } from 'lucide-react';

export default function DashboardPage() {
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchBalances = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/bitunix/balance');

            if (res.status === 401) {
                router.push('/login');
                return;
            }

            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.statusText}`);
            }

            const responseData = await res.json();

            if (responseData.code === 200 || responseData.code === 0) {
                if (responseData.data && Array.isArray(responseData.data.assets)) {
                    setBalances(responseData.data.assets);
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    setBalances(responseData.data);
                } else {
                    setBalances([]);
                }
            } else {
                throw new Error(responseData.msg || 'Unknown API error');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchBalances();
    }, [fetchBalances]);

    // Calculate Total Balance
    const totalBalance = useMemo(() => {
        return balances.reduce((acc, curr) => acc + parseFloat(curr.usdtValue), 0);
    }, [balances]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-600">Overview of your Bitunix assets</p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Balance</span>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-1 flex items-center justify-end gap-1">
                            <DollarSign className="w-8 h-8 text-blue-600" />
                            {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-lg text-gray-400 font-medium ml-2">USDT</span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <PortfolioChart />
                    </div>
                    <div className="lg:col-span-1">
                        <AllocationDonut balances={balances} />
                    </div>
                </div>

                {/* Assets Table */}
                <div className="mt-8">
                    <BalanceTable
                        balances={balances}
                        loading={loading}
                        onRefresh={fetchBalances}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
}
