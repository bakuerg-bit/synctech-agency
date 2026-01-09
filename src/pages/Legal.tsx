import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LegalProps {
  title: string;
  content: React.ReactNode;
}

const Legal = ({ title, content }: LegalProps) => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8 hover:bg-secondary/50 -ml-4 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to home
          </Button>
        </Link>

        <div className="refine-card p-10 md:p-16 border-border">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 text-foreground">
            {title}
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6 font-medium">
            {content}
          </div>
        </div>

        <p className="mt-12 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
          © {new Date().getFullYear()} Synctech · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Legal;