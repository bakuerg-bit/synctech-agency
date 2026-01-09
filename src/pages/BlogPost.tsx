import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BlogStorage, BlogPost as BlogPostType } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialShare from "@/components/SocialShare";

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPostType | null>(null);

    useEffect(() => {
        if (slug) {
            const foundPost = BlogStorage.getPostBySlug(slug);
            setPost(foundPost || null);
        }
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="py-24">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                        <Link to="/blog">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Blog
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{post.title} | Synctech Blog</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="py-24">
                    <article className="container mx-auto px-6 max-w-4xl">
                        <Link to="/blog">
                            <Button variant="ghost" className="gap-2 mb-8">
                                <ArrowLeft className="w-4 h-4" /> Back to Blog
                            </Button>
                        </Link>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        <SocialShare url={`/blog/${post.slug}`} title={post.title} description={post.excerpt} />

                        <div className="prose prose-lg max-w-none mt-12">
                            {post.content.split('\n').map((paragraph, index) => (
                                paragraph.trim() ? (
                                    <p key={index} className="mb-4 text-foreground/90 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ) : (
                                    <br key={index} />
                                )
                            ))}
                        </div>
                    </article>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default BlogPost;
