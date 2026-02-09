import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Calendar } from 'lucide-react';


const data = [
    { name: 'Jan', uv: 400 },
    { name: 'Feb', uv: 300 },
    { name: 'Mar', uv: 200 },
    { name: 'Apr', uv: 278 },
    { name: 'May', uv: 189 },
    { name: 'Jun', uv: 239 },
    { name: 'Jul', uv: 3490 }, // Spike
    { name: 'Aug', uv: 2000 },
    { name: 'Sep', uv: 2780 },
    { name: 'Oct', uv: 1890 },
    { name: 'Nov', uv: 2390 },
    { name: 'Dec', uv: 3490 },
];

const pieData = [
    { name: 'Dining', value: 2500, color: '#a78bfa' }, // violet
    { name: 'Grocery', value: 1800, color: '#60a5fa' }, // blue
    { name: 'Transport', value: 1200, color: '#34d399' }, // emerald
    { name: 'Other', value: 400, color: '#fbbf24' }, // amber
];

const Stats = () => {
    const [timeRange, setTimeRange] = useState('Monthly');

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-gray-800 font-semibold">Stats</h1>
                <div className="flex gap-4">
                    <div className="bg-slate-200 p-1 rounded-xl flex">
                        {['Weekly', 'Monthly', 'Yearly'].map((t) => (
                            <button
                                key={t}
                                className={`border-none bg-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 ${timeRange === t
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setTimeRange(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 font-medium text-gray-600 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/80 transition-colors">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm text-gray-500 mb-2 font-medium">Total Spent</h3>
                    <p className="text-3xl font-bold text-gray-800">₹7,400</p>
                    <p className="text-xs text-gray-500 mt-1">12 Categories</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm text-gray-500 mb-2 font-medium">Daily Avg</h3>
                    <p className="text-3xl font-bold text-gray-800">₹390</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm text-gray-500 mb-2 font-medium">Health</h3>
                    <p className="text-3xl font-bold text-gray-800">👍 Fair</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
                {/* Line Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[350px]">
                    <h3 className="mb-6 font-semibold text-gray-700">Monthly Spending</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[350px]">
                    <h3 className="mb-6 font-semibold text-gray-700">Expense Breakdown</h3>
                    <div className="h-[250px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Calendar Heatmap (Simplified Visual) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Activity Heatmap</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#ebedf0' }}></span> Less
                        <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#4f46e5' }}></span> More
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {/* Generating dummy boxes for a month view */}
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-6 h-6 rounded"
                            style={{
                                opacity: Math.random() > 0.3 ? 1 : 0.3,
                                backgroundColor: Math.random() > 0.6 ? '#4f46e5' : '#e2e8f0',
                            }}
                            title={`Day ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stats;
