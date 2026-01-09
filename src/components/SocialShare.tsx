import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
}

const SocialShare = ({ url, title, description }: SocialShareProps) => {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(shareLinks.twitter, '_blank')}
                title="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                title="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(shareLinks.linkedin, '_blank')}
                title="Share on LinkedIn"
            >
                <Linkedin className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                title="Copy link"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
            </Button>
        </div>
    );
};

export default SocialShare;
