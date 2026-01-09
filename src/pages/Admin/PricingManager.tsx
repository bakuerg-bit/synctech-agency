import { useState, useEffect } from 'react';
import { PricingStorage, PricingPlan } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Pencil, MoveUp, MoveDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PricingManager = () => {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const { toast } = useToast();
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: 'Zap',
        price: '',
        period: 'one-time',
        description: '',
        features: '',
        ctaText: 'Get Started',
        isPopular: false,
        displayOrder: 0
    });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const loadPlans = async () => {
        const data = await PricingStorage.getPlans();
        setPlans(data);
    };

    useEffect(() => {
        loadPlans();
        window.addEventListener('storage-pricing-updated', loadPlans);
        return () => window.removeEventListener('storage-pricing-updated', loadPlans);
    }, []);

    const handleAdd = async () => {
        if (!formData.name || !formData.price) {
            toast({ title: "Missing Fields", description: "Name and price are required.", variant: "destructive" });
            return;
        }
        const features = formData.features.split('\n').filter(f => f.trim());
        await PricingStorage.addPlan({
            ...formData,
            features,
            displayOrder: plans.length
        });
        toast({ title: "Plan Added", description: "Pricing plan created successfully." });
        setFormData({ name: '', icon: 'Zap', price: '', period: 'one-time', description: '', features: '', ctaText: 'Get Started', isPopular: false, displayOrder: 0 });
        setIsAddOpen(false);
    };

    const handleEdit = async () => {
        if (!editingPlan || !formData.name || !formData.price) return;
        const features = formData.features.split('\n').filter(f => f.trim());
        await PricingStorage.updatePlan(editingPlan.id, {
            ...formData,
            features
        });
        toast({ title: "Plan Updated", description: "Changes saved successfully." });
        setEditingPlan(null);
        setIsEditOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this pricing plan?')) {
            await PricingStorage.deletePlan(id);
            toast({ title: "Plan Deleted" });
        }
    };

    const openEditDialog = (plan: PricingPlan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            icon: plan.icon,
            price: plan.price,
            period: plan.period,
            description: plan.description,
            features: plan.features.join('\n'),
            ctaText: plan.ctaText,
            isPopular: plan.isPopular,
            displayOrder: plan.displayOrder
        });
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Pricing Plans</h1>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Pricing Plan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Plan Name</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Starter" />
                                </div>
                                <div>
                                    <Label>Icon</Label>
                                    <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Zap">Zap</SelectItem>
                                            <SelectItem value="Rocket">Rocket</SelectItem>
                                            <SelectItem value="Crown">Crown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price</Label>
                                    <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="$2,500" />
                                </div>
                                <div>
                                    <Label>Period</Label>
                                    <Input value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="one-time" />
                                </div>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Perfect for..." />
                            </div>
                            <div>
                                <Label>Features (one per line)</Label>
                                <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} rows={6} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>CTA Button Text</Label>
                                    <Input value={formData.ctaText} onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })} placeholder="Get Started" />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <Checkbox checked={formData.isPopular} onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })} />
                                    <Label>Mark as Popular</Label>
                                </div>
                            </div>
                            <Button onClick={handleAdd} className="w-full">Add Plan</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Plans</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Popular</TableHead>
                                <TableHead>Features</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>{plan.price}</TableCell>
                                    <TableCell>{plan.isPopular ? '⭐ Yes' : 'No'}</TableCell>
                                    <TableCell>{plan.features.length} features</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(plan)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Pricing Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Plan Name</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Zap">Zap</SelectItem>
                                        <SelectItem value="Rocket">Rocket</SelectItem>
                                        <SelectItem value="Crown">Crown</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Price</Label>
                                <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div>
                                <Label>Period</Label>
                                <Input value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div>
                            <Label>Features (one per line)</Label>
                            <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} rows={6} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>CTA Button Text</Label>
                                <Input value={formData.ctaText} onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2 pt-8">
                                <Checkbox checked={formData.isPopular} onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })} />
                                <Label>Mark as Popular</Label>
                            </div>
                        </div>
                        <Button onClick={handleEdit} className="w-full">Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PricingManager;
