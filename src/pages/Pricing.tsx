import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { Check, Zap, Rocket, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Temporary interface until we add to storage.ts
interface PricingPlan {
    id: string;
    name: string;
    icon: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    ctaText: string;
    isPopular: boolean;
}

const Pricing = () => {
    const [plans, setPlans] = useState<PricingPlan[]>([
        {
            id: '1',
            name: "Starter",
            icon: "Zap",
            price: "$2,500",
            period: "one-time",
            description: "Perfect for small businesses and MVPs",
            features: [
                "Single-page application",
                "Responsive design",
                "Contact form integration",
                "Basic SEO optimization",
                "2 rounds of revisions",
                "1 month support"
            ],
            ctaText: "Get Started",
            isPopular: false
        },
        {
            id: '2',
            name: "Professional",
            icon: "Rocket",
            price: "$7,500",
            period: "one-time",
            description: "For growing businesses with complex needs",
            features: [
                "Multi-page application",
                "Custom CMS/Admin panel",
                "Database integration",
                "Advanced SEO & analytics",
                "API integrations",
                "Unlimited revisions",
                "3 months support"
            ],
            ctaText: "Start Project",
            isPopular: true
        },
        {
            id: '3',
            name: "Enterprise",
            icon: "Crown",
            price: "Custom",
            period: "quote",
            description: "Tailored solutions for large-scale operations",
            features: [
                "Full-stack application",
                "Microservices architecture",
                "Cloud infrastructure setup",
                "DevOps & CI/CD pipeline",
                "Security audit & compliance",
                "Dedicated team",
                "12 months support & SLA"
            ],
            ctaText: "Contact Sales",
            isPopular: false
        }
    ]);
    const navigate = useNavigate();

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Rocket': return <Rocket className="w-8 h-8" />;
            case 'Crown': return <Crown className="w-8 h-8" />;
            default: return <Zap className="w-8 h-8" />;
        }
    };

    const handleCTAClick = () => {
        navigate('/#contact');
    };

    return (
        <>
            <Helmet>
                <title>Pricing | Synctech Ltd</title>
                <meta name="description" content="Transparent pricing for enterprise-grade digital solutions. Choose the plan that fits your business needs." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <Breadcrumbs items={[{ label: "Pricing" }]} />

                        {/* Header */}
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                Transparent Pricing
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Invest in Quality Software
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                No hidden fees. No surprises. Just exceptional engineering at fair prices.
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative p-8 rounded-2xl border ${plan.isPopular
                                            ? 'border-primary bg-primary/5 shadow-lg scale-105'
                                            : 'border-border bg-card'
                                        } transition-all duration-300 hover:shadow-xl`}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className="text-primary mb-4">{getIcon(plan.icon)}</div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.period !== "quote" && (
                                            <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant={plan.isPopular ? "default" : "outline"}
                                        className="w-full ripple-effect"
                                        onClick={handleCTAClick}
                                    >
                                        {plan.ctaText}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <div className="max-w-3xl mx-auto bg-muted/30 rounded-2xl p-12">
                            <h2 className="text-2xl font-bold mb-6 text-center">Common Questions</h2>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h3 className="font-semibold mb-2">What's included in support?</h3>
                                    <p className="text-muted-foreground">Bug fixes, minor updates, and technical assistance via email or Slack.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Do you offer payment plans?</h3>
                                    <p className="text-muted-foreground">Yes, we offer milestone-based payments for Professional and Enterprise plans.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Can I upgrade later?</h3>
                                    <p className="text-muted-foreground">Absolutely. We'll credit your initial investment toward the upgraded plan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Pricing;
