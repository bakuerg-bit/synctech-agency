import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { Quote, Star } from "lucide-react";
import { TestimonialStorage, Testimonial } from "@/lib/storage";

const Testimonials = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await TestimonialStorage.getTestimonials();
      setTestimonials(data);
    };
    loadTestimonials();
    window.addEventListener('storage-testimonials-updated', loadTestimonials);
    return () => window.removeEventListener('storage-testimonials-updated', loadTestimonials);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 text-foreground">What our partners say</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.id} delay={i * 0.1} direction="up">
              <div
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="refine-card h-full flex flex-col"
              >
                <div className="mb-6">
                  <Quote className="w-8 h-8 mb-4 text-primary/40" />
                  <p className="text-base text-foreground/90 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {testimonial.role} • {testimonial.company}
                  </p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;