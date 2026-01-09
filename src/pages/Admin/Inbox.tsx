
import { useState, useEffect } from 'react';
import { LeadStorage, Lead } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, CheckCircle, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inbox = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const { toast } = useToast();

    const loadLeads = async () => {
        const data = await LeadStorage.getLeads();
        setLeads(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        loadLeads();
        window.addEventListener('storage-leads-updated', loadLeads);
        return () => window.removeEventListener('storage-leads-updated', loadLeads);
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            LeadStorage.deleteLead(id);
            toast({ title: "Lead Deleted", description: "The inquiry has been removed permanently." });
        }
    };

    const handleStatusUpdate = (id: string, status: Lead['status']) => {
        LeadStorage.updateLeadStatus(id, status);
    };

    const renderLeadsTable = (filteredLeads: Lead[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className={lead.status === 'new' ? 'bg-muted/30' : ''}>
                        <TableCell>
                            {lead.status === 'new' && <Badge className="bg-blue-500">New</Badge>}
                            {lead.status === 'read' && <Badge variant="outline">Read</Badge>}
                            {lead.status === 'archived' && <Badge variant="secondary">Archived</Badge>}
                        </TableCell>
                        <TableCell>
                            <span className={`text-xs px-2 py-1 rounded capitalize ${lead.category === 'sales' ? 'bg-blue-100 text-blue-700' :
                                lead.category === 'support' ? 'bg-orange-100 text-orange-700' :
                                    lead.category === 'partnership' ? 'bg-purple-100 text-purple-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {lead.category}
                            </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(lead.date).toLocaleDateString()} <br />
                            {new Date(lead.date).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:underline text-primary">
                                <Mail className="w-3 h-3" /> {lead.email}
                            </a>
                        </TableCell>
                        <TableCell className="max-w-md truncate" title={lead.message}>
                            {lead.message}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                {lead.status === 'new' && (
                                    <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(lead.id, 'read')} title="Mark as Read">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(lead.id)} title="Delete">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                {filteredLeads.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No inquiries found in this category.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Inquiries Inbox</h1>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                    {leads.filter(l => l.status === 'new').length} New
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>
                        Manage inquiries received from the contact form.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All ({leads.length})</TabsTrigger>
                            <TabsTrigger value="sales">Sales ({leads.filter(l => l.category === 'sales').length})</TabsTrigger>
                            <TabsTrigger value="support">Support ({leads.filter(l => l.category === 'support').length})</TabsTrigger>
                            <TabsTrigger value="partnership">Partnership ({leads.filter(l => l.category === 'partnership').length})</TabsTrigger>
                            <TabsTrigger value="general">General ({leads.filter(l => l.category === 'general').length})</TabsTrigger>
                        </TabsList>

                        {['all', 'sales', 'support', 'partnership', 'general'].map((category) => (
                            <TabsContent key={category} value={category}>
                                {renderLeadsTable(category === 'all' ? leads : leads.filter(l => l.category === category))}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Inbox;
