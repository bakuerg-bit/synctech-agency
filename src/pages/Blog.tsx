import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BlogStorage, BlogPost } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Calendar, User, ArrowRight } from "lucide-react";

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const loadPosts = async () => {
            const data = await BlogStorage.getPosts();
            setPosts(data);
        };
        loadPosts();
        window.addEventListener('storage-blog-updated', loadPosts);
        return () => window.removeEventListener('storage-blog-updated', loadPosts);
    }, []);

    return (
        <>
            <Helmet>
                <title>Blog | Synctech Ltd</title>
                <meta name="description" content="Insights and articles from the Synctech engineering team." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="py-24">
                    <div className="container mx-auto px-6">
                        <AnimatedSection className="max-w-3xl mb-16">
                            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-4">
                                Insights
                            </p>
                            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
                                Engineering Blog
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Technical insights, best practices, and industry perspectives from our team.
                            </p>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <AnimatedSection key={post.id} delay={index * 0.1}>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="group block glass-card p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 h-full"
                                    >
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </AnimatedSection>
                            ))}

                            {posts.length === 0 && (
                                <div className="col-span-full text-center py-16 text-muted-foreground">
                                    No articles published yet. Check back soon!
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Blog;
