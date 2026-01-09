import { useState, useEffect } from 'react';
import { ServiceStorage, Service } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ServicesManager = () => {
    const [services, setServices] = useState<Service[]>([]);
    const { toast } = useToast();
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({ number: '', title: '', description: '' });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const loadServices = async () => {
        const data = await ServiceStorage.getServices();
        setServices(data);
    };

    useEffect(() => {
        loadServices();
        window.addEventListener('storage-services-updated', loadServices);
        return () => window.removeEventListener('storage-services-updated', loadServices);
    }, []);

    const handleAdd = async () => {
        if (!formData.title || !formData.description) {
            toast({ title: "Missing Fields", description: "Title and description are required.", variant: "destructive" });
            return;
        }
        const number = formData.number || `${String(services.length + 1).padStart(2, '0')}`;
        await ServiceStorage.addService({ ...formData, number });
        toast({ title: "Service Added" });
        setFormData({ number: '', title: '', description: '' });
        setIsAddOpen(false);
    };

    const handleEdit = async () => {
        if (!editingService || !formData.title || !formData.description) return;
        await ServiceStorage.updateService({ ...editingService, ...formData });
        toast({ title: "Service Updated", description: "Changes saved successfully." });
        setEditingService(null);
        setFormData({ number: '', title: '', description: '' });
        setIsEditOpen(false);
    };

    const openEdit = (s: Service) => {
        setEditingService(s);
        setFormData({
            number: s.number,
            title: s.title,
            description: s.description
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            await ServiceStorage.deleteService(id);
            toast({ title: "Service Deleted" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Services Manager</h1>

                {/* Add Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Number (optional)</Label>
                                <Input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} placeholder="e.g. 01" />
                            </div>
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Web Development" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                            </div>
                            <Button onClick={handleAdd} className="w-full">Add Service</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Number</Label>
                                <Input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                            </div>
                            <Button onClick={handleEdit} className="w-full">Save Changes</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-mono">{s.number}</TableCell>
                                    <TableCell className="font-medium">{s.title}</TableCell>
                                    <TableCell className="max-w-md truncate">{s.description}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ServicesManager;
