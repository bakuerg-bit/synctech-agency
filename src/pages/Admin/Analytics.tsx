import { useState, useEffect } from "react";
import { VisitorStorage, VisitorLog } from "@/lib/storage";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Eye, Globe } from "lucide-react";

const Analytics = () => {
    const [logs, setLogs] = useState<VisitorLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await VisitorStorage.getLogs();
            setLogs(Array.isArray(data) ? data : []);
            setLoading(false);
        };
        loadData();
    }, []);

    // Process data for charts
    const visitorsByDay = logs.reduce((acc: any, log) => {
        const date = new Date(log.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const dailyData = Object.entries(visitorsByDay).map(([date, count]) => ({
        date,
        visitors: count
    })).slice(-7); // Last 7 days

    const pageViews = logs.reduce((acc: any, log) => {
        acc[log.page] = (acc[log.page] || 0) + 1;
        return acc;
    }, {});

    const pageData = Object.entries(pageViews).map(([page, count]) => ({
        page: page || "Home",
        views: count
    })).slice(0, 5);

    const COLORS = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'];

    const stats = [
        { label: "Total Visitors", value: logs.length, icon: <Users className="w-5 h-5" />, color: "text-blue-500" },
        { label: "Unique Pages", value: Object.keys(pageViews).length, icon: <Eye className="w-5 h-5" />, color: "text-green-500" },
        { label: "Avg. Daily", value: Math.round(logs.length / 7), icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-500" },
        { label: "Countries", value: new Set(logs.map(l => l.language)).size, icon: <Globe className="w-5 h-5" />, color: "text-orange-500" }
    ];

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Visitor insights and traffic trends</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={stat.color}>{stat.icon}</div>
                            <span className="text-3xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visitor Trend */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Visitor Trend (Last 7 Days)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Pages */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={pageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="page" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="views" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Page Distribution */}
                <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Traffic Distribution</h2>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pageData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ page, percent }) => `${page}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="views"
                                >
                                    {pageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
