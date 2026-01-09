import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { ServiceStorage, Service } from "@/lib/storage";

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await ServiceStorage.getServices();
      setServices(Array.isArray(data) ? data : []);
    };
    loadServices();
    window.addEventListener('storage-services-updated', loadServices);
    return () => window.removeEventListener('storage-services-updated', loadServices);
  }, []);

  return (
    <section id="services" className="py-24 relative bg-background">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Expertise
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            What we do
          </h2>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <AnimatedSection key={service.id} delay={index * 0.1}>
              <div
                id={`service-${service.id}`}
                className="refine-card group cursor-default"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {service.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;