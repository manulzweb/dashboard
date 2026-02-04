'use client';

import { Balance } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AllocationDonutProps {
    balances: Balance[];
    onSelect?: (asset: Balance) => void;
}

const COLORS = ['#00f3ff', '#bd00ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AllocationDonut({ balances, onSelect }: AllocationDonutProps) {
    // Safe data processing
    const safeBalances = Array.isArray(balances) ? balances : [];

    // Filter out small balances and map to chart data
    const data = safeBalances
        .filter(b => b && b.usdtValue && parseFloat(b.usdtValue) > 0.01) // Filter dust
        .map(b => ({
            name: b.currency || 'Unknown',
            value: parseFloat(b.usdtValue || '0'),
            original: b // Keep reference to original object
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Top 6 assets only for clean UI

    // If no data, show empty state mock
    const displayData = data.length > 0 ? data : [{ name: 'Empty', value: 1, original: null }];
    const isPlaceholder = data.length === 0;

    return (
        <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl p-6 h-full transition-all hover:shadow-[0_0_30px_-10px_rgba(189,0,255,0.2)]">
            <h3 className="text-xl font-black text-white mb-4 tracking-tight flex items-center gap-2">
                ASSET <span className="text-[#bd00ff]">ALLOCATION</span>
            </h3>
            <div className="h-[300px] w-full flex justify-center items-center relative">
                {isPlaceholder && <div className="absolute text-gray-500 font-mono text-sm animate-pulse">NO ASSETS FOUND</div>}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={displayData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                        >
                            {displayData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={isPlaceholder ? '#1f2937' : COLORS[index % COLORS.length]}
                                    className="outline-none hover:opacity-80 transition-opacity cursor-pointer"
                                    onClick={() => {
                                        if (entry.original && onSelect) {
                                            onSelect(entry.original);
                                        }
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => isPlaceholder ? '' : `$${Number(value).toFixed(2)}`}
                            contentStyle={{
                                backgroundColor: '#0a0a0f',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#00f3ff', fontFamily: 'monospace' }}
                        />
                        {!isPlaceholder && <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ paddingTop: '20px', fontFamily: 'monospace', fontSize: '12px' }}
                        />}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
