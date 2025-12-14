"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Check if mobile width (phone)
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Capture install event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener('resize', checkMobile);
        }
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // Simple alert for iOS (or better, nothing/tooltip, but user wants banner)
            alert("To install: Tap Share button -> Add to Home Screen");
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
            }
            setDeferredPrompt(null);
        }
    };

    if (isDismissed) return null;
    if (!isMobile) return null;
    if (!deferredPrompt && !isIOS) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-0 left-0 w-full z-[9999] bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-3 shadow-lg flex items-center justify-between"
            >
                <div className="flex items-center gap-3" onClick={handleInstallClick}>
                    <div className="bg-black/20 p-2 rounded-lg">
                        <Download size={18} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Install App</span>
                        <span className="text-sm font-bold">Get the full experience</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleInstallClick}
                        className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg uppercase tracking-wide shadow-md"
                    >
                        Install
                    </button>
                    <button onClick={() => setIsDismissed(true)} className="p-1 opacity-60 hover:opacity-100">
                        <div className="w-5 h-5 flex items-center justify-center border border-black/30 rounded-full">
                            <span className="text-xs font-bold">✕</span>
                        </div>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
