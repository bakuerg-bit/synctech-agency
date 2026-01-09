import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BlogStorage, PortfolioStorage, ServiceStorage, BlogPost, Project, Service } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, FileText, Briefcase, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<{
        blogs: BlogPost[];
        projects: Project[];
        services: Service[];
    }>({ blogs: [], projects: [], services: [] });

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults({ blogs: [], projects: [], services: [] });
                return;
            }

            const lowerQuery = query.toLowerCase();

            const [allBlogs, allProjects, allServices] = await Promise.all([
                BlogStorage.getPosts(),
                PortfolioStorage.getProjects(),
                ServiceStorage.getServices()
            ]);

            const blogs = allBlogs.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.content.toLowerCase().includes(lowerQuery) ||
                p.excerpt.toLowerCase().includes(lowerQuery)
            );

            const projects = allProjects.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );

            const services = allServices.filter(s =>
                s.title.toLowerCase().includes(lowerQuery) ||
                s.description.toLowerCase().includes(lowerQuery)
            );

            setResults({ blogs, projects, services });
        };

        performSearch();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const totalResults = results.blogs.length + results.projects.length + results.services.length;

    return (
        <>
            <Helmet>
                <title>Search | Synctech Ltd</title>
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="py-24">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h1 className="text-4xl font-bold mb-8">Search</h1>

                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search blog posts, projects, services..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-10 py-6 text-lg"
                                    autoFocus
                                />
                            </div>
                        </form>

                        {query && (
                            <p className="text-muted-foreground mb-6">
                                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                            </p>
                        )}

                        {totalResults > 0 && (
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                                    <TabsTrigger value="blogs">Blog ({results.blogs.length})</TabsTrigger>
                                    <TabsTrigger value="projects">Portfolio ({results.projects.length})</TabsTrigger>
                                    <TabsTrigger value="services">Services ({results.services.length})</TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="space-y-4 mt-6">
                                    {results.blogs.map((blog) => (
                                        <Card key={blog.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <FileText className="w-5 h-5 text-primary mt-1" />
                                                    <div className="flex-1">
                                                        <Link to={`/blog/${blog.slug}`} className="text-xl font-semibold hover:text-primary">
                                                            {blog.title}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground mt-1">{blog.excerpt}</p>
                                                        <span className="text-xs text-muted-foreground">Blog Post</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {results.projects.map((project) => (
                                        <Card key={project.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <Briefcase className="w-5 h-5 text-primary mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold">{project.title}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                                        <span className="text-xs text-muted-foreground">Portfolio • {project.category}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {results.services.map((service) => (
                                        <Card key={service.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <Wrench className="w-5 h-5 text-primary mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold">{service.title}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                                                        <span className="text-xs text-muted-foreground">Service</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="blogs" className="space-y-4 mt-6">
                                    {results.blogs.map((blog) => (
                                        <Card key={blog.id}>
                                            <CardContent className="p-6">
                                                <Link to={`/blog/${blog.slug}`} className="text-xl font-semibold hover:text-primary">
                                                    {blog.title}
                                                </Link>
                                                <p className="text-sm text-muted-foreground mt-2">{blog.excerpt}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="projects" className="space-y-4 mt-6">
                                    {results.projects.map((project) => (
                                        <Card key={project.id}>
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                                                <span className="text-xs text-primary">{project.category}</span>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="services" className="space-y-4 mt-6">
                                    {results.services.map((service) => (
                                        <Card key={service.id}>
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-semibold">{service.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        )}

                        {query && totalResults === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No results found. Try a different search term.</p>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Search;
