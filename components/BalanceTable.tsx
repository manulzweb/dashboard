'use client';

import { Balance } from '@/lib/types';
import Loader from './Loader';

interface BalanceTableProps {
    balances: Balance[];
    loading: boolean;
    onRefresh: () => void;
    error: string | null;
}

export default function BalanceTable({ balances, loading, onRefresh, error }: BalanceTableProps) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Spot Balances
                </h3>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`px-3 py-1 rounded text-sm font-medium text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
                    Error: {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Currency
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Available
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Frozen
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                USDT Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && balances.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : balances.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    No balances found.
                                </td>
                            </tr>
                        ) : (
                            balances.map((balance) => (
                                <tr key={balance.currency} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {balance.currency}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {balance.available}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {balance.frozen}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {balance.usdtValue}
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
