import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HeroStorage, HeroContent } from "@/lib/storage";
import { useState, useEffect } from "react";

const Hero = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    headline: 'We Build Digital Products',
    subheadline: 'Full-stack development agency specializing in modern web applications, automation, and cloud infrastructure.',
    ctaText: 'Start Your Project',
    ctaLink: '#contact'
  });

  useEffect(() => {
    const loadHero = async () => {
      const data = await HeroStorage.getHero();
      setHeroContent(data);
    };
    loadHero();
    window.addEventListener('storage-hero-updated', loadHero);
    return () => window.removeEventListener('storage-hero-updated', loadHero);
  }, []);

  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Teal glow effect for dark mode */}
      <div className="glow-teal absolute inset-0 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className="max-w-5xl mx-auto text-center"
        >

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-border bg-card/50 backdrop-blur-sm transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Digital Services Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 tracking-tight transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {heroContent.headline.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
                {i === heroContent.headline.split('\n').length - 1 && (
                  <span className="text-primary">.</span>
                )}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {heroContent.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <a href={heroContent.ctaLink}>
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                {heroContent.ctaText}
              </Button>
            </a>
            <a href="#services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg">
                Our Work
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className={`grid grid-cols-3 divide-x divide-border py-10 transition-opacity duration-1000 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {[
              { value: "500+", label: "Projects" },
              { value: "98%", label: "Satisfaction" },
              { value: "15yr", label: "Experience" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4 group cursor-default">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;