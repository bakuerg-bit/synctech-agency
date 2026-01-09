import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TechStack = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: false });

  const technologies = [
    "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL",
    "AWS", "Docker", "Tailwind CSS", "GraphQL", "Python",
    "Redis", "Vercel", "Supabase", "Kubernetes"
  ];

  const duplicatedTech = [...technologies, ...technologies];

  return (
    <section id="stack" className="py-24 bg-secondary/5 overflow-hidden border-y border-border">
      <div className="container mx-auto px-6 mb-16 text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Expertise</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Enterprise Technology Stack</h2>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee flex whitespace-nowrap gap-16 py-8 items-center">
          {duplicatedTech.map((tech, i) => (
            <span
              key={i}
              className="text-4xl md:text-7xl font-bold text-foreground/10 hover:text-primary transition-all duration-500 cursor-default uppercase tracking-tighter"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
};

export default TechStack;