
import { useState, useEffect } from 'react';
import { SettingsStorage, SiteSettings } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const Settings = () => {
    const { toast } = useToast();
    const [settings, setSettings] = useState<SiteSettings>({
        maintenanceMode: false,
        privacyText: '',
        termsText: ''
    });

    useEffect(() => {
        const loadSettings = async () => {
            const data = await SettingsStorage.getSettings();
            setSettings(data);
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        await SettingsStorage.saveSettings(settings);
        toast({
            title: "Settings Saved",
            description: "Changes have been applied to the live site.",
        });
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>

            {/* Maintenance Mode */}
            <Card>
                <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Control the public availability of the website.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            When enabled, visitors will see the Maintenance page. Admins can still access the site.
                        </p>
                    </div>
                    <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                    />
                </CardContent>
            </Card>

            {/* Content Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>Edit key text areas on the website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="privacy">Privacy Policy Text</Label>
                        <Textarea
                            id="privacy"
                            className="min-h-[100px]"
                            value={settings.privacyText}
                            onChange={(e) => setSettings({ ...settings, privacyText: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="terms">Terms of Service Text</Label>
                        <Textarea
                            id="terms"
                            className="min-h-[100px]"
                            value={settings.termsText}
                            onChange={(e) => setSettings({ ...settings, termsText: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
