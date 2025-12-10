"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureCarousel } from "./feature-carousel";
import { HeroAnimation } from "./hero-animation";

export function MobileWelcome() {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        // Check if mobile (width < 768px)
        const isMobile = window.innerWidth < 768;
        // Check local storage
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

        if (isMobile && !hasSeenOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    const handleComplete = () => {
        setShowOnboarding(false);
        localStorage.setItem("hasSeenOnboarding", "true");
    };

    return (
        <AnimatePresence>
            {showOnboarding && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-start overflow-y-auto no-scrollbar"
                >
                    <div className="w-full min-h-screen relative flex flex-col items-center pb-20">
                        {/* Background Mesh */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,200,0,0.15),transparent_70%)] pointer-events-none" />

                        {/* Hero Section */}
                        <div className="w-full h-[50vh] flex items-center justify-center relative -mt-10">
                            <div className="scale-75 transform origin-center">
                                <HeroAnimation />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center space-y-2 -mt-10 relative z-10 px-6">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-yellow-200 to-yellow-500">
                                Fund Tracker
                            </h1>
                            <p className="text-gray-400 font-medium text-lg">
                                Finance Reimagined for Mobile
                            </p>
                        </div>

                        {/* Features */}
                        <FeatureCarousel onComplete={handleComplete} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
