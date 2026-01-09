import { useState, useEffect } from "react";
import { PortfolioStorage, Project } from "@/lib/storage";
import AnimatedSection from "./AnimatedSection";
import { ExternalLink, ArrowUpRight } from "lucide-react";

const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const loadProjects = async () => {
            const data = await PortfolioStorage.getProjects();
            setProjects(Array.isArray(data) ? data : []);
        };
        loadProjects();
        window.addEventListener('storage-portfolio-updated', loadProjects);
        return () => window.removeEventListener('storage-portfolio-updated', loadProjects);
    }, []);

    if (projects.length === 0) return null;

    return (
        <section id="portfolio" className="py-24 bg-background scroll-mt-24">
            <div className="container mx-auto px-6">

                {/* Section Header */}
                <AnimatedSection className="max-w-2xl mb-16">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                        Case Studies
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Selected projects
                    </h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <AnimatedSection key={project.id} delay={index * 0.1}>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="refine-card group block p-0 overflow-hidden"
                            >
                                {project.imageUrl && (
                                    <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <ArrowUpRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded">
                                            {project.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                            </a>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
