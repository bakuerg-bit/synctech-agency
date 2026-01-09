import { useState, useEffect } from 'react';
import { HeroStorage, HeroContent } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const HeroEditor = () => {
    const [hero, setHero] = useState<HeroContent>({
        headline: '',
        subheadline: '',
        ctaText: '',
        ctaLink: ''
    });

    useEffect(() => {
        const loadHero = async () => {
            const data = await HeroStorage.getHero();
            setHero(data);
        };
        loadHero();
    }, []);
    const { toast } = useToast();

    const handleSave = async () => {
        await HeroStorage.saveHero(hero);
        toast({ title: "Hero Updated", description: "Changes are now live on the homepage." });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Hero Section Editor</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Homepage Hero Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input
                            value={hero.headline}
                            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                            placeholder="Main headline..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Subheadline</Label>
                        <Textarea
                            value={hero.subheadline}
                            onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                            placeholder="Supporting text..."
                            rows={3}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>CTA Button Text</Label>
                            <Input
                                value={hero.ctaText}
                                onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                                placeholder="e.g. Get Started"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>CTA Link</Label>
                            <Input
                                value={hero.ctaLink}
                                onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                                placeholder="e.g. #contact"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={handleSave} className="flex-1">
                            Save Changes
                        </Button>
                        <Button variant="outline" onClick={async () => {
                            if (confirm('Reset hero content to system defaults?')) {
                                await HeroStorage.resetHero();
                                const data = await HeroStorage.getHero();
                                setHero(data);
                                toast({ title: "Hero Reset", description: "Default content restored." });
                            }
                        }}>
                            Reset Defaults
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="bg-muted/20 p-8 rounded-lg">
                    <h2 className="text-4xl font-bold mb-4">{hero.headline}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{hero.subheadline}</p>
                    <Button>{hero.ctaText}</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default HeroEditor;
