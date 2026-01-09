import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthStorage } from '@/lib/storage';

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const auth = await AuthStorage.isAuthenticated();
            setIsAuth(auth);
        };
        checkAuth();
    }, []);

    if (isAuth === null) return null; // Loading state

    if (!isAuth) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
