import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Monitor, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Detect iOS Safari (no beforeinstallprompt support)
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // Check if dismissed recently
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10);
            const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
            if (daysSince < 7) return; // Don't show for 7 days after dismissal
        }

        if (ios) {
            // Show iOS instructions after 3s
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }

        // Listen for the browser's install prompt event (Chrome, Edge, Android)
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show our custom prompt after a 3s delay for better UX
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // If prompt was already intercepted (e.g. after page reload)
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            setInstalling(true);
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
                setIsInstalled(true);
            }
            setInstalling(false);
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    if (!showPrompt || isInstalled) return null;

    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

    return (
        <>
            {/* Backdrop on mobile */}
            {isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-[998] md:hidden"
                    onClick={handleDismiss}
                />
            )}

            {/* --- MOBILE: Bottom sheet --- */}
            <div className={`
        fixed z-[999] transition-all duration-500 ease-out
        ${isMobile
                    ? 'bottom-0 left-0 right-0 md:hidden'
                    : 'bottom-5 right-5 hidden md:block'}
      `}>
                {isMobile ? (
                    // Bottom sheet for mobile
                    <div className="bg-[#0a1628] border-t border-white/10 rounded-t-2xl shadow-2xl p-6 pb-8">
                        {/* Handle bar */}
                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-lg">
                                    <img src="/Symbol.jpg" alt="FRA" className="w-9 h-9 object-contain rounded-xl"
                                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-base">FRA Portal</p>
                                    <p className="text-xs text-slate-400">Ministry of Tribal Affairs</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                            {isIOS
                                ? 'Install this app on your iPhone: tap the Share button and then "Add to Home Screen".'
                                : 'Install the FRA Portal app for faster access, offline use, and a full-screen experience — no app store needed.'
                            }
                        </p>

                        {isIOS ? (
                            // iOS instructions
                            <div className="flex items-center gap-3 p-4 bg-white/[0.06] rounded-xl border border-white/10 mb-4">
                                <Share className="w-6 h-6 text-blue-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-white">Tap <strong className="text-blue-400">Share</strong> → <strong className="text-blue-400">Add to Home Screen</strong></p>
                                    <p className="text-xs text-slate-400 mt-0.5">Works in Safari on iPhone & iPad</p>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstall}
                                disabled={installing}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-95 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60"
                            >
                                <Download className="w-5 h-5" />
                                {installing ? 'Installing…' : 'Install App'}
                            </button>
                        )}

                        <button
                            onClick={handleDismiss}
                            className="w-full text-center text-sm text-slate-500 hover:text-slate-300 mt-3 py-1 transition-colors"
                        >
                            Not now
                        </button>
                    </div>
                ) : (
                    // Desktop: floating card (bottom-right)
                    <div className="w-80 bg-[#0d1e35] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Top accent bar */}
                        <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />

                        <div className="p-5">
                            {/* Close */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Icon + title */}
                            <div className="flex items-center gap-3 mb-4 pr-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md shrink-0">
                                    <Monitor className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Install FRA Portal</p>
                                    <p className="text-xs text-slate-400">Government of India</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                Install this app on your desktop for instant access, offline support, and a native app experience.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-2 mb-5">
                                {[
                                    { icon: '⚡', text: 'Faster launch — opens like an app' },
                                    { icon: '📴', text: 'Works offline' },
                                    { icon: '🔔', text: 'Runs in its own window' },
                                ].map(item => (
                                    <div key={item.text} className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleInstall}
                                disabled={installing}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                {installing ? 'Installing…' : 'Install Now'}
                            </button>

                            <button
                                onClick={handleDismiss}
                                className="w-full text-center text-xs text-slate-600 hover:text-slate-400 mt-2.5 py-1 transition-colors"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PWAInstallPrompt;
