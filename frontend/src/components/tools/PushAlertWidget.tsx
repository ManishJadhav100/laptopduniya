"use client";
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { getApiUrl } from "@/lib/api";

interface PushAlertWidgetProps {
  laptopSlug: string;
  laptopTitle: string;
}

const PushAlertWidget: React.FC<PushAlertWidgetProps> = ({ laptopSlug, laptopTitle }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    try {
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (e) {
      console.error('VAPID key decoding failed:', e);
      return new Uint8Array();
    }
  };

  const subscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const publicVapidKey = 'BEaMKE1tcl8nT1gxIGI75TkqT0SiW2YSxSdqjf6GA6jW93WUyf4Od8KvzRgxypwdkJCiJPRBrrEjAz3DNeRNofE';
      
      let convertedKey;
      try {
        convertedKey = urlBase64ToUint8Array(publicVapidKey);
        if (convertedKey.length !== 65) {
          throw new Error('Invalid key length');
        }
      } catch (e) {
        convertedKey = new Uint8Array(65);
        convertedKey[0] = 4;
      }
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      const res = await fetch(getApiUrl(`/push-subscriptions/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laptop_slug: laptopSlug,
          endpoint: subscription.endpoint,
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!) as any)),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!) as any)),
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
      } else {
        throw new Error('Failed to save subscription');
      }
    } catch (err: any) {
      console.error('Subscription Error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Notification permission was blocked. Please enable it in browser settings.');
      } else if (err.name === 'InvalidCharacterError') {
        setError('Security key format error. Refresh and try again.');
      } else {
        setError(err.message || 'Browser not supported or permission denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#10B981] rounded-[2.5rem] p-8 shadow-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSubscribed ? 'bg-[#10B981] text-white' : 'bg-emerald-50 text-[#10B981]'}`}>
          {isSubscribed ? <BellRing className="animate-bounce" /> : <Bell />}
        </div>
        <div>
          <h4 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-1">Price Drop Alert</h4>
          <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none">Stay Notified</h3>
        </div>
      </div>

      <p className="text-xs font-bold text-gray-500 mb-8 leading-relaxed">
        {isSubscribed 
          ? `You're all set! We'll push a notification to your browser as soon as the price for this ${laptopTitle} drops.`
          : "Get a native browser notification instantly when this laptop hits your target budget. No phone number required."
        }
      </p>

      {isSubscribed ? (
        <div className="flex items-center gap-2 text-[#10B981] font-black text-[10px] uppercase tracking-widest bg-emerald-50 py-3 px-6 rounded-xl border border-emerald-100">
          <ShieldCheck size={16} /> Notification Active
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button 
            onClick={subscribe}
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? "Registering..." : "Enable Push Alerts"}
          </button>
          {error && <p className="text-[10px] text-red-500 font-bold text-center animate-pulse">{error}</p>}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
         <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Powered by Browser-Push</div>
      </div>
    </div>
  );
};

export default PushAlertWidget;
