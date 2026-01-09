import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('synctech-cookie-consent');
        if (!consent) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('synctech-cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background/95 backdrop-blur border border-border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">We use cookies 🍪</h3>
                    <p className="text-xs text-muted-foreground">
                        We use cookies to ensure you get the best experience on our website.
                        By continuing to visit this site you agree to our use of cookies.
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleAccept}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="mt-4 flex gap-2">
                <Button size="sm" className="w-full" onClick={handleAccept}>
                    Accept All
                </Button>
                <Button size="sm" variant="outline" className="w-full" onClick={handleAccept}>
                    Necessary Only
                </Button>
            </div>
        </div>
    );
};

export default CookieConsent;
