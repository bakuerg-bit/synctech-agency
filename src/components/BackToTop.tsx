import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[60] p-4 rounded-full glass border border-border/50 shadow-hover transition-all duration-500 hover:scale-110 hover:-translate-y-2 group animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
      )}
    </>
  );
};

export default BackToTop;