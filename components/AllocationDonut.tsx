'use client';

import { Balance } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AllocationDonutProps {
    balances: Balance[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function AllocationDonut({ balances }: AllocationDonutProps) {
    // Safe data processing
    const safeBalances = Array.isArray(balances) ? balances : [];

    // Filter out small balances and map to chart data
    const data = safeBalances
        .filter(b => b && b.usdtValue && parseFloat(b.usdtValue) > 0.01) // Filter dust
        .map(b => ({
            name: b.currency || 'Unknown',
            value: parseFloat(b.usdtValue || '0')
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Top 6 assets only for clean UI

    // If no data, show empty state mock
    const displayData = data.length > 0 ? data : [{ name: 'Empty', value: 1 }];
    const isPlaceholder = data.length === 0;

    return (
        <div className="bg-white/50 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Asset Allocation</h3>
            <div className="h-[300px] w-full flex justify-center items-center">
                {isPlaceholder && <div className="absolute text-gray-400 text-sm">No assets found</div>}
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
                                    fill={isPlaceholder ? '#e5e7eb' : COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => isPlaceholder ? '' : `$${Number(value).toFixed(2)}`}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: '#374151', fontWeight: 600 }}
                        />
                        {!isPlaceholder && <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ paddingTop: '20px' }}
                        />}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
