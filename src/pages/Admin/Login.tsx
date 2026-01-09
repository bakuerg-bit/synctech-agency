import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await AuthStorage.login(email, password);
            toast({
                title: "Authentication successful",
                description: `Welcome. Access granted.`,
            });
            navigate('/admin/dashboard');
        } catch (error: any) {
            toast({
                title: "Authentication failed",
                description: error.message || "Invalid credentials",
                variant: "destructive"
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-white/5 bg-zinc-900/50 backdrop-blur-xl shadow-2xl relative z-10 transition-all duration-500 hover:border-primary/20">
                <CardHeader className="space-y-4 pb-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2 border border-primary/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-white">Admin Access</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Synctech Ltd Ecosystem Infrastructure
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-400 text-xs font-bold uppercase tracking-widest pl-1">Email</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@synctech.com"
                                    className="pl-10 bg-zinc-950/50 border-white/10 focus:border-primary/50 transition-colors h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-400 text-xs font-bold uppercase tracking-widest pl-1">Authorization Code</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 bg-zinc-950/50 border-white/10 focus:border-primary/50 transition-colors h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="pt-4 pb-8">
                        <Button
                            type="submit"
                            className="w-full h-11 font-bold tracking-wider uppercase text-xs btn-glow"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Establish Connection"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="absolute bottom-8 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium text-center w-full">
                Encrypted Connection &bull; Synctech Security Protocol v2.4
            </div>
        </div>
    );
};

export default Login;
