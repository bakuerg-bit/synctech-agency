
import { useState, useEffect } from 'react';
import { PortfolioStorage, Project } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, ExternalLink, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const PortfolioManager = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const { toast } = useToast();
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({ title: '', category: '', description: '', imageUrl: '', link: '' });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const loadProjects = async () => {
        const data = await PortfolioStorage.getProjects();
        setProjects(data);
    };

    useEffect(() => {
        loadProjects();
        window.addEventListener('storage-portfolio-updated', loadProjects);
        return () => window.removeEventListener('storage-portfolio-updated', loadProjects);
    }, []);

    const handleAdd = async () => {
        if (!formData.title) return;
        await PortfolioStorage.addProject(formData);
        toast({ title: "Project Added", description: "Your portfolio has been updated." });
        setFormData({ title: '', category: '', description: '', imageUrl: '', link: '' });
        setIsAddOpen(false);
    };

    const handleEdit = async () => {
        if (!editingProject || !formData.title) return;
        await PortfolioStorage.updateProject({ ...editingProject, ...formData });
        toast({ title: "Project Updated", description: "Changes saved successfully." });
        setEditingProject(null);
        setFormData({ title: '', category: '', description: '', imageUrl: '', link: '' });
        setIsEditOpen(false);
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            category: project.category,
            description: project.description,
            imageUrl: project.imageUrl,
            link: project.link
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            await PortfolioStorage.deleteProject(id);
            toast({ title: "Project Deleted" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Portfolio Manager</h1>

                {/* Add Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Project title..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Web App" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Description..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Project Link</Label>
                                <Input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="#" />
                            </div>
                            <Button onClick={handleAdd} className="w-full">Create Project</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Project Link</Label>
                                <Input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                            </div>
                            <Button onClick={handleEdit} className="w-full">Save Changes</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded" />}
                                    </TableCell>
                                    <TableCell className="font-medium">{p.title}</TableCell>
                                    <TableCell>{p.category}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {projects.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No projects yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default PortfolioManager;
