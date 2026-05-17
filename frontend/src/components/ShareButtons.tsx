"use client";
import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  shareText?: string;
}

export default function ShareButtons({ title, shareText = "Share" }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only access window on the client
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <Share2 className="w-10 h-10 text-gray-400 mb-4" />
      <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">{shareText}</h4>
      <div className="flex gap-6">
        <button 
          onClick={shareToFacebook}
          className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors cursor-pointer shadow-sm"
          aria-label="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </button>
        
        <button 
          onClick={shareToTwitter}
          className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-colors cursor-pointer shadow-sm"
          aria-label="Share on Twitter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
        </button>
        
        <button 
          onClick={handleCopy}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer shadow-sm ${copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-[#10B981] hover:text-white hover:border-[#10B981]'}`}
          aria-label="Copy Link"
        >
          {copied ? <CheckCircle2 size={18} /> : <LinkIcon size={18} />}
        </button>
      </div>
    </div>
  );
}
