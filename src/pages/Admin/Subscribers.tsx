import { useState, useEffect } from 'react';
import { NewsletterStorage, Subscriber } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const { toast } = useToast();

    const loadSubscribers = async () => {
        const data = await NewsletterStorage.getSubscribers();
        setSubscribers(data);
    };

    useEffect(() => {
        loadSubscribers();
        window.addEventListener('storage-newsletter-updated', loadSubscribers);
        return () => window.removeEventListener('storage-newsletter-updated', loadSubscribers);
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Remove this subscriber?')) {
            await NewsletterStorage.deleteSubscriber(id);
            toast({ title: "Subscriber Removed" });
        }
    };

    const handleExport = () => {
        const csv = 'Email,Date,Status\n' +
            subscribers.map(s => `${s.email},${new Date(s.date).toLocaleDateString()},${s.status}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast({ title: "Exported", description: "Subscriber list downloaded as CSV." });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
                <Button onClick={handleExport} className="gap-2" disabled={subscribers.length === 0}>
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Subscribers ({subscribers.filter(s => s.status === 'active').length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Subscribed Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscribers.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(sub.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {sub.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {subscribers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No subscribers yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Subscribers;
