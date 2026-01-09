import { supabase } from './supabase';

// --- Interfaces (Kept for compatibility, but aligned with DB) ---

export interface VisitorLog {
  id: string;
  timestamp: string;
  page: string;
  userAgent: string;
  referrer: string;
  screenResolution: string;
  language: string;
}

// Visitor logs can stay local or be moved to DB. Moving to DB is better for analytics.
// For now, let's keep VisitorLogs in localStorage to avoid spamming the DB with hits during dev,
// OR implement a simple 'insert' only. Let's keep it simple: insert to DB.
export const VisitorStorage = {
  getLogs: async (): Promise<VisitorLog[]> => {
    const { data, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return data || [];
  },

  addLog: async (log: Omit<VisitorLog, 'id' | 'timestamp'>) => {
    await supabase.from('visitor_logs').insert([{
      page: log.page,
      user_agent: log.userAgent, // Map to snake_case column
      referrer: log.referrer,
      screen_resolution: log.screenResolution,
      language: log.language
    }]);
  },

  clearLogs: async () => {
    // No-op
  }
};

export const AuthStorage = {
  // Supabase manages auth state automatically, but we might need wrappers for the Login page.
  login: async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

export interface SiteSettings {
  maintenanceMode: boolean;
  privacyText: string;
  termsText: string;
}

export const SettingsStorage = {
  getSettings: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error || !data) {
      return {
        maintenanceMode: false,
        privacyText: "At Synctech...",
        termsText: "By engaging..."
      };
    }
    // Map snake_case to camelCase
    return {
      maintenanceMode: data.maintenance_mode,
      privacyText: data.privacy_text,
      termsText: data.terms_text
    };
  },

  saveSettings: async (settings: SiteSettings) => {
    // valid UUID or single row logic needed.
    // We assume there's only one row.
    // First get the ID
    const { data } = await supabase.from('site_settings').select('id').single();
    if (data) {
      await supabase.from('site_settings').update({
        maintenance_mode: settings.maintenanceMode,
        privacy_text: settings.privacyText,
        terms_text: settings.termsText,
        updated_at: new Date().toISOString()
      }).eq('id', data.id);
    } else {
      await supabase.from('site_settings').insert([{
        maintenance_mode: settings.maintenanceMode,
        privacy_text: settings.privacyText,
        terms_text: settings.termsText
      }]);
    }
    window.dispatchEvent(new Event('storage-settings-updated'));
  }
};

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'archived';
  category: 'sales' | 'support' | 'partnership' | 'general';
}

export const LeadStorage = {
  getLeads: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];

    return (data || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      message: d.message,
      date: d.created_at,
      status: d.status,
      category: d.category
    }));
  },

  addLead: async (lead: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const { error } = await supabase.from('leads').insert([{
      ...lead,
      status: 'new'
    }]);
    if (error) throw error;
    window.dispatchEvent(new Event('storage-leads-updated'));
  },

  updateLeadStatus: async (id: string, status: Lead['status']) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    window.dispatchEvent(new Event('storage-leads-updated'));
  },

  deleteLead: async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    window.dispatchEvent(new Event('storage-leads-updated'));
  }
};

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
}

export const PortfolioStorage = {
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      description: d.description,
      imageUrl: d.image_url,
      link: d.link
    }));
  },

  addProject: async (project: Omit<Project, 'id'>) => {
    await supabase.from('projects').insert([{
      title: project.title,
      category: project.category,
      description: project.description,
      image_url: project.imageUrl,
      link: project.link
    }]);
    window.dispatchEvent(new Event('storage-portfolio-updated'));
  },

  updateProject: async (project: Project) => {
    await supabase.from('projects').update({
      title: project.title,
      category: project.category,
      description: project.description,
      image_url: project.imageUrl,
      link: project.link
    }).eq('id', project.id);
    window.dispatchEvent(new Event('storage-portfolio-updated'));
  },

  deleteProject: async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    window.dispatchEvent(new Event('storage-portfolio-updated'));
  }
};

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
}

export const BlogStorage = {
  getPosts: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((d: any) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      excerpt: d.excerpt,
      author: d.author,
      date: d.created_at,
      slug: d.slug
    }));
  },

  getAllPostsAdmin: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((d: any) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      excerpt: d.excerpt,
      author: d.author,
      date: d.created_at,
      slug: d.slug
    }));
  },

  addPost: async (post: Omit<BlogPost, 'id' | 'date' | 'slug'>) => {
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await supabase.from('blog_posts').insert([{
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      slug,
      published: true
    }]);
    window.dispatchEvent(new Event('storage-blog-updated'));
  },

  updatePost: async (post: BlogPost) => {
    // Slug update logic if title changes? Maybe optional.
    await supabase.from('blog_posts').update({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author
    }).eq('id', post.id);
    window.dispatchEvent(new Event('storage-blog-updated'));
  },

  deletePost: async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    window.dispatchEvent(new Event('storage-blog-updated'));
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (error || !data) return undefined;
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      date: data.created_at,
      slug: data.slug
    };
  }
};

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  status: 'active' | 'unsubscribed';
}

export const NewsletterStorage = {
  getSubscribers: async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase.from('subscribers').select('*');
    if (error) return [];
    return (data || []).map((d: any) => ({
      id: d.id,
      email: d.email,
      date: d.created_at,
      status: d.status
    }));
  },

  addSubscriber: async (email: string) => {
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) {
      if (error.code === '23505') return { success: false, message: 'Already subscribed' };
      return { success: false, message: 'Internal error' };
    }
    window.dispatchEvent(new Event('storage-newsletter-updated'));
    return { success: true, message: 'Subscribed successfully' };
  },

  deleteSubscriber: async (id: string) => {
    await supabase.from('subscribers').delete().eq('id', id);
    window.dispatchEvent(new Event('storage-newsletter-updated'));
  }
};

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
}

export const HeroStorage = {
  getHero: async (): Promise<HeroContent> => {
    const { data } = await supabase.from('hero_content').select('*').eq('active', true).single();
    if (!data) {
      return {
        headline: 'We Build Digital Products',
        subheadline: 'Full-stack development agency...',
        ctaText: 'Start Your Project',
        ctaLink: '#contact'
      };
    }
    return {
      headline: data.headline,
      subheadline: data.subheadline,
      ctaText: data.cta_text,
      ctaLink: data.cta_link
    };
  },

  saveHero: async (hero: HeroContent) => {
    // Assuming single active logic or update latest
    const { data } = await supabase.from('hero_content').select('id').eq('active', true).single();
    if (data) {
      await supabase.from('hero_content').update({
        headline: hero.headline,
        subheadline: hero.subheadline,
        cta_text: hero.ctaText,
        cta_link: hero.ctaLink
      }).eq('id', data.id);
    } else {
      await supabase.from('hero_content').insert([{
        headline: hero.headline,
        subheadline: hero.subheadline,
        cta_text: hero.ctaText,
        cta_link: hero.ctaLink,
        active: true
      }]);
    }
    window.dispatchEvent(new Event('storage-hero-updated'));
  },

  resetHero: async () => {
    // delete all or reset to default?
    // impl: delete all active
    await supabase.from('hero_content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    window.dispatchEvent(new Event('storage-hero-updated'));
  }
};

export interface BlogHeader {
  title: string;
  subtitle: string;
  badge: string;
}

export const BlogHeaderStorage = {
  getHeader: async (): Promise<BlogHeader> => {
    const { data } = await supabase.from('blog_header').select('*').single();
    if (!data) {
      return {
        title: "Engineering Blog",
        subtitle: "Technical insights...",
        badge: "Insights"
      };
    }
    return data;
  },

  saveHeader: async (header: BlogHeader) => {
    const { data } = await supabase.from('blog_header').select('id').single();
    if (data) {
      await supabase.from('blog_header').update(header).eq('id', data.id);
    } else {
      await supabase.from('blog_header').insert([header]);
    }
    window.dispatchEvent(new Event('storage-blog-header-updated'));
  }
};

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image?: string;
}

export const TestimonialStorage = {
  getTestimonials: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error) return [];
    return (data || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      role: d.role,
      company: d.company,
      quote: d.quote,
      rating: d.rating,
      image: d.image_url
    }));
  },

  addTestimonial: async (testimonial: Omit<Testimonial, 'id'>) => {
    await supabase.from('testimonials').insert([{
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      quote: testimonial.quote,
      rating: testimonial.rating,
      image_url: testimonial.image
    }]);
    window.dispatchEvent(new Event('storage-testimonials-updated'));
  },

  updateTestimonial: async (testimonial: Testimonial) => {
    await supabase.from('testimonials').update({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      quote: testimonial.quote,
      rating: testimonial.rating,
      image_url: testimonial.image
    }).eq('id', testimonial.id);
    window.dispatchEvent(new Event('storage-testimonials-updated'));
  },

  deleteTestimonial: async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    window.dispatchEvent(new Event('storage-testimonials-updated'));
  }
};

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon?: string;
}

export const ServiceStorage = {
  getServices: async (): Promise<Service[]> => {
    const { data, error } = await supabase.from('services').select('*').order('number', { ascending: true });
    if (error) return [];
    return data || [];
  },

  addService: async (service: Omit<Service, 'id'>) => {
    await supabase.from('services').insert([service]);
    window.dispatchEvent(new Event('storage-services-updated'));
  },

  updateService: async (service: Service) => {
    await supabase.from('services').update(service).eq('id', service.id);
    window.dispatchEvent(new Event('storage-services-updated'));
  },

  deleteService: async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    window.dispatchEvent(new Event('storage-services-updated'));
  }
};
