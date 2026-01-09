import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogStorage, BlogPost } from "@/lib/storage";
import AnimatedSection from "./AnimatedSection";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const BlogPreview = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const loadPosts = async () => {
            const data = await BlogStorage.getPosts();
            setPosts(Array.isArray(data) ? data.slice(0, 3) : []);
        };
        loadPosts();
        window.addEventListener('storage-blog-updated', loadPosts);
        return () => window.removeEventListener('storage-blog-updated', loadPosts);
    }, []);

    if (posts.length === 0) return null;

    return (
        <section id="blog-preview" className="py-24 bg-background scroll-mt-24">
            <div className="container mx-auto px-6">
                <AnimatedSection className="max-w-2xl mb-16">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                        Insights
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Latest from our blog
                    </h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {posts.map((post, index) => (
                        <AnimatedSection key={post.id} delay={index * 0.1}>
                            <Link
                                to={`/blog/${post.slug}`}
                                className="refine-card group block h-full flex flex-col hover:border-primary/50"
                            >
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(post.date).toLocaleDateString()}
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection className="text-center">
                    <Link to="/blog">
                        <Button variant="outline" size="lg" className="rounded-xl border-border px-8">
                            View all articles
                        </Button>
                    </Link>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default BlogPreview;
