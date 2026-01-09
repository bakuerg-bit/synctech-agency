import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Portfolio from "@/components/Portfolio";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Work = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <Breadcrumbs items={[{ label: "Work" }]} />
                </div>
                <div className="container mx-auto px-6 text-center mb-16">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                        Selected Projects
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Work</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A showcase of our technical capabilities and design precision.
                        We build software that solves complex problems.
                    </p>
                </div>

                <div className="container mx-auto px-6">
                    <Portfolio />
                </div>

                <div className="container mx-auto px-6 mt-24 text-center bg-muted/30 rounded-2xl py-16">
                    <h2 className="text-3xl font-bold mb-4">Have a project in mind?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        We specialize in taking ambitious ideas from concept to scalable production.
                    </p>
                    <Link to="/#contact">
                        <Button size="lg" className="gap-2">
                            Start a Conversation <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Work;
