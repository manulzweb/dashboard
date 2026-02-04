'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface PortfolioChartProps {
    selectedAsset?: any | null;
}

export default function PortfolioChart({ selectedAsset }: PortfolioChartProps) {
    // In a real app, you would fetch history based on `selectedAsset.currency`.
    // For now, we simulate a "live" feeling trend or static data.
    const data = [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 5000 },
        { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 },
        { name: 'Sat', value: 2390 },
        { name: 'Sun', value: 3490 },
    ];

    return (
        <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl p-6 h-full transition-all hover:shadow-[0_0_30px_-10px_rgba(0,243,255,0.2)] group">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                        {selectedAsset ? (
                            <>
                                <span className="text-[#00f3ff]">{selectedAsset.currency}</span> TREND
                            </>
                        ) : 'PORTFOLIO TREND'}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-1">
                        {selectedAsset ? `Live price action for ${selectedAsset.currency}/USDT` : '7 Day Performance'}
                    </p>
                </div>
                <span className="text-xs font-bold text-[#0a0a0f] bg-[#00f3ff] px-3 py-1 rounded shadow-[0_0_10px_#00f3ff]">LIVE</span>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                            dy={10}
                        />
                        <YAxis
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0a0a0f',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#00f3ff', fontFamily: 'monospace' }}
                            cursor={{ stroke: '#bd00ff', strokeWidth: 1, strokeDasharray: '4 4' }}
                            formatter={(value: any) => [`$${value}`, 'Value']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#00f3ff"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
