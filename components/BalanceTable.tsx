'use client';

import { Balance } from '@/lib/types';
import Loader from './Loader';
import { RefreshCw, Wallet, Snowflake } from 'lucide-react';

interface BalanceTableProps {
    balances: Balance[];
    loading: boolean;
    onRefresh: () => void;
    error: string | null;
}

export default function BalanceTable({ balances, loading, onRefresh, error }: BalanceTableProps) {
    return (
        <div className="bg-white/50 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/20 flex justify-between items-center bg-white/40">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    Spot Balances
                </h3>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${loading
                            ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                        }`}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50/80 backdrop-blur text-red-600 border-b border-red-100 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Asset
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Available
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Frozen
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                USDT Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/30 divide-y divide-gray-100">
                        {loading && balances.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : balances.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                    No balances found. Start trading to see assets here.
                                </td>
                            </tr>
                        ) : (
                            balances.map((balance) => (
                                <tr key={balance.currency} className="hover:bg-blue-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                                                {balance.currency.substring(0, 2)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{balance.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">
                                        {Number(balance.available).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right flex items-center justify-end gap-1">
                                        {Number(balance.frozen) > 0 && <Snowflake className="w-3 h-3 text-blue-300" />}
                                        {Number(balance.frozen).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-right">
                                        ${Number(balance.usdtValue).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
