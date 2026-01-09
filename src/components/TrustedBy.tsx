import { Cloud, Globe, Server, Shield, Smartphone, HardDrive } from "lucide-react";

const TrustedBy = () => {
    return (
        <section className="py-12 border-b border-border bg-card/10">
            <div className="container mx-auto px-6">
                <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
                    Technologies Powering Our Solutions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
                    <div className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity">
                        <Cloud className="h-8 w-8 text-foreground" />
                        <span className="text-xs font-semibold">Cloud Native</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity">
                        <Server className="h-8 w-8 text-foreground" />
                        <span className="text-xs font-semibold">Serverless</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity">
                        <Shield className="h-8 w-8 text-foreground" />
                        <span className="text-xs font-semibold">Security First</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity">
                        <Globe className="h-8 w-8 text-foreground" />
                        <span className="text-xs font-semibold">Global Scale</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity">
                        <Smartphone className="h-8 w-8 text-foreground" />
                        <span className="text-xs font-semibold">Mobile First</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity">
                        <HardDrive className="h-8 w-8 text-foreground" />
                        <span className="text-xs font-semibold">High Performance</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
