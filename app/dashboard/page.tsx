'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import BalanceTable from '@/components/BalanceTable';
import { Balance, UserAccount } from '@/lib/types';
import { useRouter } from 'next/navigation';

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

            // Adaptation: Bitunix response usually wraps data in 'data'.
            // Our API route returns whatever Bitunix returns.
            // Let's assume UserAccount is the shape of data, or data.data?
            // lib/types.ts says BitunixResponse<T> { data: T }
            // Our API route returns `data` which is BitunixResponse<UserAccount>. 
            // Verify route.ts "return NextResponse.json(data);" where data = bitunixFetch -> returns BitunixResponse<UserAccount>

            if (responseData.code === 200 || responseData.code === 0) { // Success codes vary, often 0 or 200
                // data.data should be UserAccount
                if (responseData.data && Array.isArray(responseData.data.assets)) {
                    setBalances(responseData.data.assets);
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    // Sometimes it's direct array? Just defensive coding.
                    setBalances(responseData.data);
                } else {
                    // Maybe assets are missing or filtered
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

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">Overview of your Bitunix assets.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* We can add Transfer/Withdraw widgets here later */}
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
