
import { useEffect, useState } from 'react';
import { VisitorStorage, VisitorLog, LeadStorage, NewsletterStorage, BlogStorage, PortfolioStorage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Eye, Monitor, Globe, Mail, TrendingUp, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
    const [logs, setLogs] = useState<VisitorLog[]>([]);
    const [leads, setLeads] = useState(0);
    const [subscribers, setSubscribers] = useState(0);
    const [blogPosts, setBlogPosts] = useState(0);
    const [projects, setProjects] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        const loadData = () => {
            setLogs(VisitorStorage.getLogs());
            setLeads(LeadStorage.getLeads().length);
            setSubscribers(NewsletterStorage.getSubscribers().filter(s => s.status === 'active').length);
            setBlogPosts(BlogStorage.getPosts().length);
            setProjects(PortfolioStorage.getProjects().length);
        };
        loadData();
        // Refresh every 5 seconds
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Calculate metrics
    const uniqueVisitors = new Set(logs.map(log => log.userAgent)).size;
    const conversionRate = logs.length > 0 ? ((leads / logs.length) * 100).toFixed(1) : '0';

    // Format data for chart (group by hour)
    const chartData: { time: string; visits: number }[] = logs.reduce((acc: { time: string; visits: number }[], log) => {
        const date = new Date(log.timestamp);
        const time = `${date.getHours()}:00`;
        const existing = acc.find(item => item.time === time);
        if (existing) {
            existing.visits++;
        } else {
            acc.push({ time, visits: 1 });
        }
        return acc;
    }, []).sort((a, b) => parseInt(a.time) - parseInt(b.time));

    // Popular pages
    const pageViews = logs.reduce((acc: Record<string, number>, log) => {
        acc[log.page] = (acc[log.page] || 0) + 1;
        return acc;
    }, {});
    const popularPages = Object.entries(pageViews)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    // If chart data is empty, simulate some 0 points for better look
    if (chartData.length === 0) {
        chartData.push({ time: '00:00', visits: 0 });
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            {/* Main Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{logs.length}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {logs.filter(l => new Date(l.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length} in last 24h
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniqueVisitors}</div>
                        <p className="text-xs text-muted-foreground">
                            {conversionRate}% conversion rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads}</div>
                        <p className="text-xs text-muted-foreground">Contact form submissions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscribers}</div>
                        <p className="text-xs text-muted-foreground">Newsletter subscribers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{blogPosts}</div>
                        <p className="text-xs text-muted-foreground">Published articles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects}</div>
                        <p className="text-xs text-muted-foreground">Active projects</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Page</CardTitle>
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {popularPages[0]?.page || '/'}
                        </div>
                        <p className="text-xs text-muted-foreground">{popularPages[0]?.views || 0} views</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {logs.length > 0 ? new Date(logs[0].timestamp).toLocaleTimeString() : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Last visit time</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="time" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Popular Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={popularPages}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="page" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Bar dataKey="views" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-7"> {/* Adjusted col-span to fit the layout */}
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Visitors</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                                if (confirm('Permanently clear all visitor logs?')) {
                                    VisitorStorage.clearLogs();
                                    setLogs([]);
                                    toast({ title: "Logs Cleared" });
                                }
                            }}
                        >
                            Clear Logs
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead className="text-right">Device</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.slice(0, 5).map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                                        <TableCell>{log.page}</TableCell>
                                        <TableCell className="text-right truncate max-w-[100px]" title={log.userAgent}>
                                            {log.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {logs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No visits recorded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
