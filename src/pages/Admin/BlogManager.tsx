import { useState, useEffect } from 'react';
import { BlogStorage, BlogPost } from '@/lib/storage';
import { sendEmailNotification } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Eye, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const BlogManager = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const { toast } = useToast();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', author: 'Synctech Team' });
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const loadPosts = async () => {
        const data = await BlogStorage.getPosts();
        setPosts(data);
    };

    useEffect(() => {
        loadPosts();
        window.addEventListener('storage-blog-updated', loadPosts);
        return () => window.removeEventListener('storage-blog-updated', loadPosts);
    }, []);

    const handleAdd = async () => {
        if (!formData.title || !formData.content) {
            toast({ title: "Missing Fields", description: "Title and content are required.", variant: "destructive" });
            return;
        }
        await BlogStorage.addPost(formData);

        // Send email notification for new blog post
        await sendEmailNotification('blog', {
            title: formData.title,
            excerpt: formData.excerpt,
            author: formData.author
        });

        toast({ title: "Post Published", description: "Your article is now live." });
        setFormData({ title: '', excerpt: '', content: '', author: 'Synctech Team' });
        setIsAddOpen(false);
    };

    const handleEdit = async () => {
        if (!editingPost || !formData.title || !formData.content) return;
        await BlogStorage.updatePost({ ...editingPost, ...formData });
        toast({ title: "Post Updated", description: "Changes saved successfully." });
        setEditingPost(null);
        setFormData({ title: '', excerpt: '', content: '', author: 'Synctech Team' });
        setIsEditOpen(false);
    };

    const openEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            await BlogStorage.deletePost(id);
            toast({ title: "Post Deleted" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Blog Manager</h1>

                {/* Add Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Blog Post</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Post title..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Excerpt</Label>
                                <Textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary..." rows={2} />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Article content..." rows={10} />
                            </div>
                            <div className="space-y-2">
                                <Label>Author</Label>
                                <Input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                            </div>
                            <Button onClick={handleAdd} className="w-full">Publish Post</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Blog Post</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Excerpt</Label>
                                <Textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={10} />
                            </div>
                            <div className="space-y-2">
                                <Label>Author</Label>
                                <Input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                            </div>
                            <Button onClick={handleEdit} className="w-full">Save Changes</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Published Articles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>{post.author}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(post.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={`/blog/${post.slug}`} target="_blank">
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
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

export default BlogManager;
