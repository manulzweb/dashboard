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

export default function PortfolioChart() {
    // In a real app, you would fetch history. For now, we simulate a "live" feeling trend.
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
        <div className="bg-white/50 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-full transition-all hover:shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                Portfolio Trend
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">7 Day</span>
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                            cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                            formatter={(value: any) => [`$${value}`, 'Value']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
