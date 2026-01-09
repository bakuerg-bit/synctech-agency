
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Settings as SettingsIcon, Inbox, Briefcase, FileText, Users, Megaphone, MessageSquare, Wrench, BarChart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const auth = await AuthStorage.isAuthenticated();
            if (!auth) {
                navigate('/admin/login');
            } else {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await AuthStorage.logout();
        navigate('/admin/login');
    };

    if (!isAuthenticated) return null;

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: 'Analytics', href: '/admin/analytics', icon: <BarChart className="h-4 w-4" /> },
        { label: 'Inbox', href: '/admin/inbox', icon: <Inbox className="h-4 w-4" /> },
        { label: 'Subscribers', href: '/admin/subscribers', icon: <Users className="h-4 w-4" /> },
        { label: 'Portfolio', href: '/admin/portfolio', icon: <Briefcase className="h-4 w-4" /> },
        { label: 'Blog', href: '/admin/blog', icon: <FileText className="h-4 w-4" /> },
        { label: 'Hero', href: '/admin/hero', icon: <Megaphone className="h-4 w-4" /> },
        { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare className="h-4 w-4" /> },
        { label: 'Services', href: '/admin/services', icon: <Wrench className="h-4 w-4" /> },
        { label: 'Pricing', href: '/admin/pricing', icon: <DollarSign className="h-4 w-4" /> },
        { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon className="h-4 w-4" /> },
    ];

    return (
        <div className="min-h-screen bg-muted/10">
            <header className="bg-background border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <LayoutDashboard className="h-6 w-6" />
                        <span>Synctech Admin</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={location.pathname === item.href ? "secondary" : "ghost"}
                                asChild
                                className={cn("gap-2", location.pathname === item.href && "bg-secondary font-medium")}
                            >
                                <Link to={item.href}>
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>

                    <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </header>

            {/* Mobile Nav */}
            <div className="md:hidden border-b bg-background overflow-x-auto">
                <div className="flex p-2 gap-2 container mx-auto">
                    {navItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={location.pathname === item.href ? "secondary" : "ghost"}
                            size="sm"
                            asChild
                            className="gap-2 shrink-0"
                        >
                            <Link to={item.href}>
                                {item.icon}
                                {item.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
