import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How long does a typical project take?", a: "Most custom web solutions are delivered within 4-8 weeks, depending on complexity and API integrations." },
    { q: "Do you offer post-launch support?", a: "Yes, we provide technical monitoring and monthly maintenance packages to keep your system optimized and secure." },
    { q: "Can you integrate with existing systems?", a: "Our team specializes in bridging modern frontends with existing legacy databases or cloud architectures." },
    { q: "Is mobile responsiveness included?", a: "Every project is built mobile-first, ensuring perfect performance across all devices and screen sizes." }
  ];

  return (
    <section id="faq" className="py-24 bg-background relative scroll-mt-24">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Support
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
        </AnimatedSection>

        <div className="max-w-3xl">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className={`mb-4 border border-border rounded-xl transition-all duration-300 overflow-hidden ${activeIndex === i ? 'bg-secondary/20 border-primary/30' : 'bg-card/50 hover:bg-secondary/10'
                  }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4"
                >
                  <span className="text-lg font-semibold text-foreground">
                    {faq.q}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeIndex === i ? 'bg-primary text-white rotate-0' : 'bg-secondary text-muted-foreground'
                    }`}>
                    {activeIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${activeIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.a}
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

export default FAQ;