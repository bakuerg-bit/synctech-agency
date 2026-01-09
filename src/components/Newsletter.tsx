import { useState } from 'react';
import { NewsletterStorage } from '@/lib/storage';
import { Button } from './ui/button';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Artificial delay for professional feel
        await new Promise(resolve => setTimeout(resolve, 600));

        const result = await NewsletterStorage.addSubscriber(email);

        if (result.success) {
            toast({ title: "Successfully Subscribed", description: "You'll receive our monthly engineering insights." });
            setEmail('');
        } else {
            toast({ title: "Notice", description: result.message, variant: "destructive" });
        }

        setLoading(false);
    };

    return (
        <div className="bg-secondary/5 border-t border-border py-20">
            <div className="container mx-auto px-6">
                <div className="refine-card max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 p-10 md:p-16 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight mb-4">Stay ahead of the curve</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Join 5,000+ developers and leaders getting our monthly newsletter on software architecture and digital trends.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3 min-w-[320px]">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all flex-1 min-w-[240px]"
                        />
                        <Button type="submit" disabled={loading} className="rounded-xl px-6 h-11">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    Subscribe <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
