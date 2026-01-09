import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronDown, Search } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { ServiceStorage, Service } from "@/lib/storage";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await ServiceStorage.getServices();
      setServices(Array.isArray(data) ? data : []);
    };
    loadServices();
    window.addEventListener('storage-services-updated', loadServices);
    return () => window.removeEventListener('storage-services-updated', loadServices);
  }, []);

  // Auto-close expanded menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const serviceList = Array.isArray(services) ? services : [];

  const menus = {
    services: serviceList.map(s => ({
      title: s.title,
      desc: s.description,
      href: `#service-${s.id}`
    })),
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Synctech</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {Object.entries(menus).map(([key, options]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors capitalize">
                    {key} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMenu === key ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Panel */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[480px] pt-4 transition-all duration-200 ${activeMenu === key ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                    <div className="refine-card p-6 shadow-xl">
                      <div className="grid grid-cols-2 gap-4">
                        {options.map((option) => (
                          <a
                            key={option.title}
                            href={option.href}
                            className="group/item p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                            onMouseEnter={() => setHoveredItem(option.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div className="text-sm font-semibold text-foreground mb-1 group-hover/item:text-primary transition-colors">
                              {option.title}
                            </div>
                            <div className="text-xs text-muted-foreground leading-relaxed">
                              {option.desc}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/work" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Work</Link>
              <a href="#about" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>

            {/* RIGHT SIDE: Search + Toggle + Button */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              <ModeToggle />
              <a href="#contact">
                <Button variant="hero" size="sm" className="rounded-none text-[11px] uppercase tracking-[0.2em]">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile Side Button + Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              <ModeToggle />
              <button className="text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`w-full h-px bg-foreground transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`w-full h-px bg-foreground transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-px bg-foreground transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          {isOpen && (
            <div className="fixed inset-0 top-16 z-40 md:hidden animate-fade-in bg-background dark:bg-black/95 backdrop-blur-2xl px-6 py-10 border-t border-border/50 overflow-y-auto h-[calc(100vh-64px)]">
              <div className="flex flex-col gap-8">
                {Object.entries(menus).map(([key, options]) => (
                  <div key={key} className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{key}</h4>
                    <div className="grid gap-4">
                      {options.map((option) => (
                        <a
                          key={option.title}
                          href={option.href}
                          className="block group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="text-lg font-semibold text-foreground">{option.title}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Main Section Links */}
                <div className="space-y-4 pt-4 border-t border-border/30">
                  <a href="#about" className="block text-2xl font-bold tracking-tighter text-foreground" onClick={() => setIsOpen(false)}>About</a>
                  <a href="#contact" className="block text-2xl font-bold tracking-tighter text-foreground" onClick={() => setIsOpen(false)}>Contact</a>
                </div>

                <a href="#contact" onClick={() => setIsOpen(false)} className="mt-4 pb-20">
                  <Button variant="hero" className="w-full rounded-none h-14 text-sm uppercase tracking-widest">
                    Get Started
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;