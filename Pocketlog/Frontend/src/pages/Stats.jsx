import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';


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

    // Generate dynamic mock data based on time range
    const getChartData = () => {
        if (timeRange === 'Weekly') {
            return [
                { name: 'Mon', uv: 100 },
                { name: 'Tue', uv: 200 },
                { name: 'Wed', uv: 150 },
                { name: 'Thu', uv: 300 },
                { name: 'Fri', uv: 250 },
                { name: 'Sat', uv: 400 },
                { name: 'Sun', uv: 380 },
            ];
        } else if (timeRange === 'Yearly') {
            return [
                { name: '2020', uv: 15000 },
                { name: '2021', uv: 18000 },
                { name: '2022', uv: 22000 },
                { name: '2023', uv: 25000 },
                { name: '2024', uv: 29000 },
            ];
        }
        // Default Monthly
        return data;
    };

    const currentData = getChartData();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-3xl text-gray-800 font-semibold">Stats</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="bg-slate-200 p-1 rounded-xl flex w-full sm:w-auto justify-between sm:justify-start">
                        {['Weekly', 'Monthly', 'Yearly'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={`border-none bg-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 flex-1 sm:flex-none ${timeRange === t
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setTimeRange(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-gray-600 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/80 transition-colors w-full sm:w-auto">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 opacity-70"></div>
                    <div>
                        <h3 className="text-sm text-gray-500 mb-2 font-medium">Total Expense</h3>
                        <p className="text-3xl font-bold text-gray-800">₹7,400</p>
                    </div>
                    <p className="text-xs text-rose-500 mt-4 font-medium flex items-center gap-1">
                        <TrendingUp size={14} /> +12% from last month
                    </p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 opacity-70"></div>
                    <div>
                        <h3 className="text-sm text-gray-500 mb-2 font-medium">Total Income</h3>
                        <p className="text-3xl font-bold text-gray-800">₹45,500</p>
                    </div>
                    <p className="text-xs text-emerald-500 mt-4 font-medium flex items-center gap-1">
                        <TrendingUp size={14} /> +5% from last month
                    </p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-70"></div>
                    <div>
                        <h3 className="text-sm text-gray-500 mb-2 font-medium">Avg Spending</h3>
                        <p className="text-3xl font-bold text-gray-800">₹390 <span className="text-sm text-gray-400 font-normal">/ day</span></p>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 font-medium flex items-center gap-1">
                        Based on last 30 days
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
                {/* Line Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[350px]">
                    <h3 className="mb-6 font-semibold text-gray-700">Monthly Spending</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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

           
        </div>
    );
};

export default Stats;