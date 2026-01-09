import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import TechStack from "@/components/TechStack";
import Portfolio from "@/components/Portfolio";
import BlogPreview from "@/components/BlogPreview";
import { SettingsStorage, SiteSettings } from "@/lib/storage";
import { useState, useEffect } from "react";

const Index = () => {
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

  return (
    <>
      <Helmet>
        <title>Synctech | Digital Engineering & Solutions</title>
        <meta
          name="description"
          content="Transform your business with Synctech's innovative digital solutions. Enterprise-grade web development, cloud infrastructure, and custom software engineering."
        />
        <meta name="keywords" content="web development, cloud solutions, software engineering, digital transformation, enterprise applications" />
        <meta property="og:title" content="Synctech | Digital Engineering & Solutions" />
        <meta property="og:description" content="Enterprise-grade digital solutions and software engineering services" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          {/* Hero Section - First Impression */}
          <Hero />

          {/* Services - What We Offer */}
          <Services />

          {/* Portfolio - Proof of Work */}
          <Portfolio />

          {/* Tech Stack - Our Expertise */}
          <TechStack />

          {/* Testimonials - Social Proof */}
          <Testimonials />

          {/* About - Company Story */}
          <About />

          {/* Blog Preview - Thought Leadership */}
          <BlogPreview />

          {/* FAQ - Address Common Questions */}
          <FAQ />

          {/* Contact - Call to Action */}
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;