
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { VisitorStorage } from '@/lib/storage';

export const useVisitorTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Don't track admin pages to avoid polluting data
        if (location.pathname.startsWith('/admin')) return;

        VisitorStorage.addLog({
            page: location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language
        });
    }, [location]);
};
