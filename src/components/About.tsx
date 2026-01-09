import AnimatedSection from "./AnimatedSection";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Enterprise-grade solutions",
  "Agile development",
  "24/7 support",
  "Transparent pricing",
  "Scalable architecture",
  "Data security",
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary/10 scroll-mt-24 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Content Column */}
          <div className="flex flex-col justify-center">
            <AnimatedSection>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                About Us
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
                Building the future of digital experiences
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                With over 15 years of experience, we combine technical expertise with creative thinking to deliver
                solutions that transform businesses. Our approach is simple: understand deeply, execute precisely,
                and iterate continuously.
              </p>
            </AnimatedSection>

            {/* Features List */}
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Stats Card */}
          <AnimatedSection delay={0.2} direction="left" className="flex items-center">
            <div className="refine-card w-full p-12">
              <div className="space-y-8">
                {[
                  { value: "500+", label: "Projects delivered" },
                  { value: "98%", label: "Client satisfaction" },
                  { value: "15yr", label: "Industry experience" },
                ].map((stat, index) => (
                  <div key={stat.label} className={index !== 0 ? "border-t border-border pt-8" : ""}>
                    <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

export default About;