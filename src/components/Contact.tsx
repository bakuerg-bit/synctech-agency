import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LeadStorage, Lead } from "@/lib/storage";
import { sendEmailNotification } from "@/lib/notifications";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Lead['category']>('general');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      await LeadStorage.addLead({ name, email, message, category });

      // Send email notification
      await sendEmailNotification('lead', { name, email, message, category });

      const response = await fetch("https://formspree.io/f/xkoweedl", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        toast({ title: "Message Sent", description: "We'll get back to you shortly." });
        (e.target as HTMLFormElement).reset();
      } else { throw new Error(); }
    } catch (error) {
      toast({ variant: "destructive", title: "Wait a moment...", description: "Please try again or email us directly." });
    } finally { setLoading(false); }
  };

  const contactDetails = [
    { icon: <Mail className="w-5 h-5" />, label: "Email us", value: "tech@synctechltd.space", href: "mailto:tech@synctechltd.space" },
    { icon: <Phone className="w-5 h-5" />, label: "Call us", value: "+355 69 297 6930", href: "tel:+355692976930" },
    { icon: <MapPin className="w-5 h-5" />, label: "Office", value: "Tirana, Albania", href: "#" }
  ];

  return (
    <section id="contact" className="py-24 bg-background scroll-mt-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Contact Info */}
          <div>
            <AnimatedSection>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Get in Touch</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-8">
                Ready to build something together?
              </h2>
              <p className="text-muted-foreground text-lg mb-12">
                Have a vision for your next digital product? Let's discuss how we can turn your ideas into a powerful reality.
              </p>
            </AnimatedSection>

            <div className="space-y-6">
              {contactDetails.map((item, index) => (
                <AnimatedSection key={item.label} delay={0.1 + index * 0.1} direction="up">
                  <a href={item.href} className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                    </div>
                  </a>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <AnimatedSection delay={0.3}>
            <div className="refine-card p-10 border-primary/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input name="name" required type="text" placeholder="John Doe" className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <input name="email" required type="email" placeholder="john@example.com" className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiry Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Lead['category'])}
                    className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                  >
                    <option value="general">General Project Inquiry</option>
                    <option value="sales">Product Sales</option>
                    <option value="partnership">Strategic Partnership</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea name="message" required rows={5} placeholder="Tell us about your project..." className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
                </div>

                <Button disabled={loading} type="submit" variant="hero" className="w-full py-6 text-sm font-bold uppercase tracking-widest group">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <span className="flex items-center gap-2">
                      Send message <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

export default Contact;