import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, AlertTriangle, Lightbulb, Activity, ChevronRight, BarChart3, Droplets, MapPin, Loader2, ServerCrash } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface AIInsightData {
    summary: string;
    metrics: {
        total_villages: number;
        high_priority_count: number;
        water_stress_average: number;
    };
    alerts: Array<{
        title: string;
        level: 'high' | 'medium' | 'low';
        description: string;
    }>;
    recommendations: string[];
}

const AIInsights = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<AIInsightData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                setLoading(true);
                // Use environment variable for production deployed URL, fallback to local python server
                const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://localhost:5001';
                const res = await fetch(`${apiUrl}/api/insights`);
                if (!res.ok) {
                    throw new Error('Could not connect to the Python AI Insights server.');
                }
                const json = await res.json();
                setData(json);
                setError(null);
            } catch (err: any) {
                console.error("AI Insights Error:", err);
                setError(err.message || 'Failed to load AI Insights');
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    const getAlertColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getAlertIconColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-amber-600';
            case 'low': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    // Mock chart data to visualize trends
    const trendData = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 550 },
        { name: 'Apr', value: 200 },
        { name: 'May', value: 278 },
        { name: 'Jun', value: 189 },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-gray-500">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h3 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 outline-none select-none text-transparent bg-clip-text">
                    Running Data Analytics...
                </h3>
                <p className="text-sm mt-2 text-gray-400">Our Python backend is analyzing the village dataset to generate insights.</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <ServerCrash className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Backend Connection Failed</h3>
                    <p className="text-gray-600 mb-6 text-sm">{error || "Make sure the Python API is running on port 5001."}</p>
                    <div className="bg-white rounded-lg p-4 text-left border border-gray-200">
                        <h4 className="font-semibold text-sm mb-2 text-gray-800">How to fix this:</h4>
                        <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1.5 marker:text-gray-400">
                            <li>Open the project folder: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-red-600">c:\win_m-indicator-ai-hackathon\</code></li>
                            <li>Double-click the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">start_ai_insights.bat</code> or run the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">ai-backend/app.py</code> script.</li>
                            <li>Wait for the console window to say "Starting on Port 5001"</li>
                            <li>Refresh this page.</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row shadow-sm sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden">
                {/* Abstract background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 right-40 -mb-20 w-48 h-48 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                            <Sparkles className="w-6 h-6 text-blue-100" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Executive Insights</h1>
                    </div>
                    <p className="text-blue-100 max-w-2xl text-sm sm:text-base leading-relaxed opacity-90">
                        {data.summary}
                    </p>
                </div>

                <div className="relative z-10 flex border border-white/20 bg-black/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 shrink-0 shadow-inner">
                    <div className="text-center px-4">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-blue-200">
                            {data.metrics.total_villages.toLocaleString()}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold mt-1">Villages Scanned</div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Left Column: Metrics & Alerts */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <AlertTriangle className="w-24 h-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Critical Priority</h3>
                                <span className="bg-red-50 text-red-600 p-2 rounded-lg"><AlertTriangle className="w-5 h-5" /></span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-4xl font-bold text-gray-900">{data.metrics.high_priority_count.toLocaleString()}</div>
                                <div className="text-sm text-red-600 flex items-center mt-2 font-medium">
                                    <Activity className="w-4 h-4 mr-1" /> Requires urgent attention
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Droplets className="w-24 h-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Water Stress Avg</h3>
                                <span className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Droplets className="w-5 h-5" /></span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-4xl font-bold text-gray-900">{data.metrics.water_stress_average}%</div>
                                <div className="text-sm text-gray-500 flex items-center mt-2">
                                    <BarChart3 className="w-4 h-4 mr-1" /> Across all surveyed districts
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Alerts List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-indigo-500" /> Detected Anomalies
                            </h2>
                        </div>
                        <div className="p-2">
                            <ul className="divide-y divide-gray-50">
                                {data.alerts.map((alert, idx) => (
                                    <li key={idx} className="p-4 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${getAlertColor(alert.level).split(' ')[0]}`} style={{ boxShadow: `0 0 10px var(--tw-shadow-color)` }}></div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-base font-semibold text-gray-900">{alert.title}</h4>
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${getAlertColor(alert.level)}`}>
                                                        {alert.level} Risk
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{alert.description}</p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center self-center text-gray-400">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" /> Priority Deficit Trend
                            </h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Right Column: AI Recommendations */}
                <div className="space-y-6 sm:space-y-8">
                    <div className="bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden relative h-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                                    <Lightbulb className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
                            </div>

                            <div className="space-y-5">
                                {data.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed pt-1 font-medium">
                                            {rec}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-indigo-100">
                                <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center">
                                    Export Action Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;
