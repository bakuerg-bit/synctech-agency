import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BackToTop from "@/components/BackToTop";
import Legal from "./pages/Legal";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/theme-provider";
import Maintenance from "./pages/Maintenance";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import CookieConsent from "./components/CookieConsent";
import Inbox from "./pages/Admin/Inbox";
import Settings from "./pages/Admin/Settings";
import PortfolioManager from "./pages/Admin/PortfolioManager";
import BlogManager from "./pages/Admin/BlogManager";
import Subscribers from "./pages/Admin/Subscribers";
import HeroEditor from "./pages/Admin/HeroEditor";
import TestimonialsManager from "./pages/Admin/TestimonialsManager";
import ServicesManager from "./pages/Admin/ServicesManager";
import Analytics from "./pages/Admin/Analytics";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Blog from "./pages/Blog";
import Work from "./pages/Work";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import BlogPost from "./pages/BlogPost";
import Search from "./pages/Search";
import { useVisitorTracking } from "./hooks/use-visitor-tracking";
import { SettingsStorage, SiteSettings } from "./lib/storage";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Inner component to use hooks that require Router context
const AppRoutes = () => {
  useVisitorTracking();
  const [settings, setSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    privacyText: '',
    termsText: ''
  });

  useEffect(() => {
    SettingsStorage.getSettings().then(setSettings);
  }, []);
  const navigate = useNavigate();

  // Listen for storage updates
  useEffect(() => {
    const handleStorageUpdate = async () => {
      const data = await SettingsStorage.getSettings();
      setSettings(data);
    };
    window.addEventListener('storage-settings-updated', handleStorageUpdate);
    return () => window.removeEventListener('storage-settings-updated', handleStorageUpdate);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/search" element={<Search />} />

        <Route
          path="/privacy"
          element={
            <Legal
              title="Privacy Policy"
              content={
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{settings.privacyText}</p>
                </div>
              }
            />
          }
        />

        <Route
          path="/terms"
          element={
            <Legal
              title="Terms of Service"
              content={
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{settings.termsText}</p>
                </div>
              }
            />
          }
        />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="portfolio" element={<PortfolioManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="/admin/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
    </>
  );
};

const App = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    privacyText: '',
    termsText: ''
  });

  useEffect(() => {
    SettingsStorage.getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    const handleStorageUpdate = async () => {
      const data = await SettingsStorage.getSettings();
      setSettings(data);
    };
    window.addEventListener('storage-settings-updated', handleStorageUpdate);
    return () => window.removeEventListener('storage-settings-updated', handleStorageUpdate);
  }, []);

  // Check if we are trying to access admin
  const isExcludedPath = window.location.pathname.startsWith('/admin');

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />

            {/* Main Application Container */}
            <div className="min-h-screen bg-background text-foreground">
              {settings.maintenanceMode && !isExcludedPath ? (
                /* Only the Maintenance page shows when active, unless accessing admin */
                <Maintenance />
              ) : (
                /* Full Website Routing */
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              )}
              <CookieConsent />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;