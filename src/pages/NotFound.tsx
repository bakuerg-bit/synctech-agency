import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User tried to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      {/* Container with your established glass-card style */}
      <div className="glass-card max-w-lg w-full p-12 rounded-[2.5rem] text-center border border-border/50 animate-slide-up">
        
        {/* Error Code */}
        <span className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">
          Error 404
        </span>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-6">
          Lost in the stack?
        </h1>

        <p className="text-muted-foreground text-lg mb-10 font-normal leading-relaxed">
          The page you're looking for doesn't exist or has been moved within the Synctech infrastructure.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="hero" className="w-full sm:w-auto px-8 py-6 flex items-center gap-2 group">
              <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              Back to Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-6 bg-transparent border-border/60 hover:bg-secondary/50 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Subtle Brand Footer */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} Synctech Ltd
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;