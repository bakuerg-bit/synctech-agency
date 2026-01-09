import { useState, useEffect } from 'react';
import { TestimonialStorage, Testimonial } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Star, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const { toast } = useToast();
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({ name: '', role: '', company: '', quote: '', rating: 5, image: '' });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const loadTestimonials = async () => {
        const data = await TestimonialStorage.getTestimonials();
        setTestimonials(data);
    };

    useEffect(() => {
        loadTestimonials();
        window.addEventListener('storage-testimonials-updated', loadTestimonials);
        return () => window.removeEventListener('storage-testimonials-updated', loadTestimonials);
    }, []);

    const handleAdd = async () => {
        if (!formData.name || !formData.quote) {
            toast({ title: "Missing Fields", description: "Name and quote are required.", variant: "destructive" });
            return;
        }
        await TestimonialStorage.addTestimonial(formData);
        toast({ title: "Testimonial Added" });
        setFormData({ name: '', role: '', company: '', quote: '', rating: 5, image: '' });
        setIsAddOpen(false);
    };

    const handleEdit = async () => {
        if (!editingTestimonial || !formData.name || !formData.quote) return;
        await TestimonialStorage.updateTestimonial({ ...editingTestimonial, ...formData });
        toast({ title: "Testimonial Updated", description: "Changes saved successfully." });
        setEditingTestimonial(null);
        setFormData({ name: '', role: '', company: '', quote: '', rating: 5, image: '' });
        setIsEditOpen(false);
    };

    const openEdit = (t: Testimonial) => {
        setEditingTestimonial(t);
        setFormData({
            name: t.name,
            role: t.role,
            company: t.company,
            quote: t.quote,
            rating: t.rating,
            image: t.image || ''
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            await TestimonialStorage.deleteTestimonial(id);
            toast({ title: "Testimonial Deleted" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Testimonials Manager</h1>

                {/* Add Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Testimonial
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Testimonial</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Quote</Label>
                                <Textarea value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} rows={4} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rating (1-5)</Label>
                                <Input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} />
                            </div>
                            <Button onClick={handleAdd} className="w-full">Add Testimonial</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Quote</Label>
                                <Textarea value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} rows={4} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rating (1-5)</Label>
                                <Input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} />
                            </div>
                            <Button onClick={handleEdit} className="w-full">Save Changes</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Quote</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.name}</TableCell>
                                    <TableCell>{t.role} at {t.company}</TableCell>
                                    <TableCell className="max-w-md truncate">{t.quote}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
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

export default TestimonialsManager;
