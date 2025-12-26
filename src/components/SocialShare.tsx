import { Facebook, Twitter, Linkedin, Mail, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

export default function SocialShare({
  url,
  title,
  description = '',
  hashtags = ['RideForVisionAndValour', 'CMTA'],
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.join(',');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-5 h-5" />
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>

        <a
          href={shareLinks.email}
          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          aria-label="Share via Email"
        >
          <Mail className="w-5 h-5" />
        </a>

        <button
          onClick={handleCopyLink}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors relative"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Link2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {copied && (
        <span className="text-sm text-green-600 font-medium">Link copied!</span>
      )}
    </div>
  );
}
