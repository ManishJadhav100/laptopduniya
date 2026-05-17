"use client";
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Loader2, ArrowRight } from 'lucide-react';
import { getApiUrl } from "@/lib/api";

const GlobalPushPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem('push_popup_dismissed');
    const subscribed = localStorage.getItem('push_subscribed');
    
    if (!dismissed && !subscribed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    setLoading(true);
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }
      
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      
      const publicVapidKey = 'BEaMKE1tcl8nT1gxIGI75TkqT0SiW2YSxSdqjf6GA6jW93WUyf4Od8KvzRgxypwdkJCiJPRBrrEjAz3DNeRNofE';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      const res = await fetch(getApiUrl(`/push-subscriptions/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!) as any)),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!) as any)),
          interest_type: 'ALL'
        }),
      });

      if (res.ok) {
        setSuccess(true);
        localStorage.setItem('push_subscribed', 'true');
        setTimeout(() => setIsVisible(false), 3000);
      } else {
        const errData = await res.json();
        console.error('Server rejected subscription:', errData);
      }
    } catch (err: any) {
      console.error('Subscription failed at browser level:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem('push_popup_dismissed', Date.now().toString());
  };

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-left-20 duration-500 max-w-sm w-full">
      <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(16,185,129,0.15)] border border-emerald-50 flex gap-5 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#10B981] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity" />
        
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
          {success ? (
            <Check className="text-[#10B981] w-7 h-7 animate-in zoom-in" />
          ) : (
            <Bell className="text-[#10B981] w-7 h-7 animate-bounce" />
          )}
        </div>

        <div className="flex flex-col gap-1 pr-4">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            {success ? "You're all set! 🚀" : "Get Real-time Content Alerts 🔔"}
          </h3>
          <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
            {success ? "Welcome to the elite club." : "Price drops, reviews & hot news."}
          </p>
          
          {!success && (
            <div className="flex items-center gap-4 mt-3">
              <button 
                onClick={subscribe}
                disabled={loading}
                className="bg-[#10B981] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={12} /> : "Enable Now"}
                {!loading && <ArrowRight size={12} />}
              </button>
              <button 
                onClick={dismiss}
                className="text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest"
              >
                Maybe Later
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default GlobalPushPopup;
