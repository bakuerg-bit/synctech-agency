import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Settings } from "lucide-react";

const Maintenance = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 10000);
    return () => clearInterval(interval);
  }, [theme, setTheme]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative overflow-hidden transition-colors"
      style={{ transitionDuration: '2000ms' }}
    >
      {/* Background Decorative Glow */}
      <div className="glow-teal absolute inset-0 pointer-events-none opacity-20" />

      <div className="refine-card p-12 text-center max-w-lg relative z-10 border-primary/20">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary animate-spin-slow">
            <Settings className="w-8 h-8" />
          </div>
        </div>

        <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">
          Status: Refining Architecture
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-6">
          System calibration in progress
        </h1>

        <p className="text-muted-foreground mb-10 text-sm leading-relaxed">
          We're currently performing a scheduled design and infrastructure synchronization.
          The full Synctech experience will be available shortly.
        </p>

        <a href="mailto:tech@synctechltd.space">
          <Button variant="hero" className="rounded-xl px-8 h-12 font-bold uppercase tracking-wider text-xs">
            Contact Support
          </Button>
        </a>
      </div>

      <div className="absolute bottom-12 flex items-center gap-3">
        <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Live Sync Active</span>
      </div>
    </div>
  );
};

export default Maintenance;