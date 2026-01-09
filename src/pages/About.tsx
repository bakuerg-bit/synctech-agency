import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { Target, Users, Zap, Shield } from "lucide-react";

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us | Synctech Ltd</title>
                <meta name="description" content="Learn about Synctech's mission, values, and the team behind our enterprise-grade digital solutions." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <Breadcrumbs items={[{ label: "About" }]} />

                        {/* Hero Section */}
                        <div className="max-w-4xl mx-auto text-center mb-20">
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                Our Story
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Building the Future of Digital Infrastructure
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                We're a team of engineers, designers, and strategists who believe that exceptional software
                                should be the standard, not the exception. Since our founding, we've been committed to
                                delivering solutions that don't just work—they excel.
                            </p>
                        </div>

                        {/* Values Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                            {[
                                {
                                    icon: <Target className="w-8 h-8" />,
                                    title: "Precision",
                                    description: "Every line of code is intentional. We build systems that are elegant, efficient, and maintainable."
                                },
                                {
                                    icon: <Users className="w-8 h-8" />,
                                    title: "Collaboration",
                                    description: "Your success is our success. We work as an extension of your team, not just a vendor."
                                },
                                {
                                    icon: <Zap className="w-8 h-8" />,
                                    title: "Innovation",
                                    description: "We stay ahead of the curve, adopting proven technologies that give you a competitive edge."
                                },
                                {
                                    icon: <Shield className="w-8 h-8" />,
                                    title: "Reliability",
                                    description: "We build for scale and security from day one. Your infrastructure should never be a bottleneck."
                                }
                            ].map((value, index) => (
                                <div key={index} className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                                    <div className="text-primary mb-4">{value.icon}</div>
                                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mission Statement */}
                        <div className="max-w-3xl mx-auto bg-muted/30 rounded-2xl p-12 text-center">
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                To empower businesses with software that scales effortlessly, performs flawlessly,
                                and adapts seamlessly to the ever-changing digital landscape. We don't just build applications—we
                                architect ecosystems that drive growth and innovation.
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default About;
