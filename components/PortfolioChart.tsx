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
        axisLine = { false}
                            tickFormatter = {(value) => `$${value}`
}
                        />
    < Tooltip
contentStyle = {{
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
            border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}}
                        />
    < Area
type = "monotone"
dataKey = "value"
stroke = "#3b82f6"
strokeWidth = { 3}
fillOpacity = { 1}
fill = "url(#colorValue)"
    />
                    </AreaChart >
                </ResponsiveContainer >
            </div >
        </div >
    );
}
