'use client';

import { Balance } from '@/lib/types';
import Loader from './Loader';
import { RefreshCw, Wallet, Snowflake, Search, ArrowUpDown, ChevronUp, ChevronDown, TrendingUp } from 'lucide-react';
import { useState, useMemo } from 'react';

interface BalanceTableProps {
    balances: Balance[];
    loading: boolean;
    onRefresh: () => void;
    error: string | null;
}

type SortKey = 'currency' | 'available' | 'frozen' | 'usdtValue';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export default function BalanceTable({ balances, loading, onRefresh, error }: BalanceTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'usdtValue', direction: 'desc' });

    // Handle Sorting Logic
    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
        }));
    };

    // Filter and Sort Data
    const processedBalances = useMemo(() => {
        let data = [...balances];

        // 1. Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter((b) => b.currency.toLowerCase().includes(lowerTerm));
        }

        // 2. Sort
        data.sort((a, b) => {
            const aValue = sortConfig.key === 'currency' ? a.currency : parseFloat(a[sortConfig.key] || '0');
            const bValue = sortConfig.key === 'currency' ? b.currency : parseFloat(b[sortConfig.key] || '0');

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return data;
    }, [balances, searchTerm, sortConfig]);

    return (
        <div className="relative group">
            {/* Cyberpunk Glow Background Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00f3ff] via-[#bd00ff] to-[#00f3ff] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

            <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">

                {/* Header Section */}
                <div className="px-6 py-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-[#00f3ff]/20 to-[#bd00ff]/20 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                            <Wallet className="w-6 h-6 text-[#00f3ff]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                                ASSETS
                            </h3>
                            <p className="text-xs text-[#00f3ff]/70 font-mono tracking-widest uppercase">Live Balance Feed</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative group/search w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within/search:text-[#bd00ff] transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="SEARCH COIN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#bd00ff]/50 focus:ring-1 focus:ring-[#bd00ff]/50 transition-all font-mono"
                            />
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className={`p-2 rounded-lg border border-white/10 transition-all duration-300 ${loading
                                ? 'bg-[#00f3ff]/10 text-[#00f3ff] cursor-not-allowed'
                                : 'bg-white/5 text-gray-300 hover:bg-[#00f3ff]/10 hover:text-[#00f3ff] hover:border-[#00f3ff]/30 box-glow'
                                }`}
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-900/20 border-b border-red-500/30 backdrop-blur flex items-center gap-3">
                        <div className="w-1 h-8 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        <div className="text-red-200 text-sm">
                            <span className="font-bold text-red-500 block mb-0.5">SYSTEM ERROR</span>
                            {error.includes('APP_KEY') ? 'Auth Key Rejected' : error}
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/5">
                        <thead className="bg-black/40">
                            <tr>
                                <SortableHeader label="ASSET" sortKey="currency" currentSort={sortConfig} onSort={handleSort} align="left" />
                                <SortableHeader label="AVAILABLE" sortKey="available" currentSort={sortConfig} onSort={handleSort} align="right" />
                                <SortableHeader label="LOCKED" sortKey="frozen" currentSort={sortConfig} onSort={handleSort} align="right" />
                                <SortableHeader label="VALUE (USDT)" sortKey="usdtValue" currentSort={sortConfig} onSort={handleSort} align="right" icon={<TrendingUp className="w-3 h-3 text-[#bd00ff]" />} />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                            {loading && balances.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <Loader />
                                            <span className="text-[#00f3ff] font-mono text-sm animate-pulse">SYNCING CHAIN DATA...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : processedBalances.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="text-gray-500 font-mono text-sm">NO ASSETS FOUND</div>
                                    </td>
                                </tr>
                            ) : (
                                processedBalances.map((balance) => (
                                    <tr key={balance.currency} className="group/row hover:bg-white/[0.02] transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1a1a23] to-[#0d0d12] border border-white/10 flex items-center justify-center group-hover/row:border-[#00f3ff]/30 group-hover/row:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all">
                                                    <span className="text-[#00f3ff] font-bold text-xs font-mono">
                                                        {(balance.currency || '?').substring(0, 3)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-200 group-hover/row:text-white transition-colors">
                                                        {balance.currency || 'UNKNOWN'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 font-mono">SPOT</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-mono text-gray-300 group-hover/row:text-[#00f3ff] transition-colors">
                                                {Number(balance.available).toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 text-sm text-gray-500 font-mono">
                                                {Number(balance.frozen) > 0 && <Snowflake className="w-3 h-3 text-[#bd00ff]" />}
                                                {Number(balance.frozen).toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 group-hover/row:from-[#00f3ff] group-hover/row:to-[#bd00ff] transition-all">
                                                ${Number(balance.usdtValue).toFixed(2)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Headers
function SortableHeader({ label, sortKey, currentSort, onSort, align, icon }: any) {
    const isActive = currentSort.key === sortKey;

    return (
        <th
            scope="col"
            onClick={() => onSort(sortKey)}
            className={`px-6 py-4 text-${align} text-[10px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-[#00f3ff] transition-colors select-none group/header`}
        >
            <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {label}
                {isActive ? (
                    currentSort.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-[#00f3ff]" /> : <ChevronDown className="w-3 h-3 text-[#00f3ff]" />
                ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/header:opacity-50 transition-opacity" />
                )}
                {icon}
            </div>
        </th>
    );
}
