import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This instantly resets the scroll to the top of the page
    window.scrollTo(0, 0);
  }, [pathname]); // Fires every time the URL path changes

  return null;
};

export default ScrollToTop;