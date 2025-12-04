"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Globe, Instagram, Linkedin } from "lucide-react";

export function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#F8F9FF] text-slate-900 selection:bg-blue-100">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px]" />

            {/* Floating 3D Elements */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-[15%] left-1/2 -translate-x-1/2 z-10"
            >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mix-blend-multiply">
                    <Image
                        src="/thumbs-up.png"
                        alt="Thumbs Up"
                        fill
                        className="object-contain"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -50, rotate: -20 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute bottom-[20%] left-[10%] md:left-[15%] z-0"
            >
                <div className="relative w-20 h-20 md:w-28 md:h-28 mix-blend-multiply opacity-80">
                    <Image
                        src="/shape-green.png"
                        alt="Shape"
                        fill
                        className="object-contain"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50, rotate: 20 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute bottom-[25%] right-[10%] md:right-[15%] z-0"
            >
                <div className="relative w-20 h-20 md:w-28 md:h-28 mix-blend-multiply opacity-80">
                    <Image
                        src="/shape-gold.png"
                        alt="Shape"
                        fill
                        className="object-contain"
                    />
                </div>
            </motion.div>


            <div className="container mx-auto px-4 z-20 flex flex-col items-center text-center mt-20">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">
                        We're Still
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-emerald-600"
                >
                    Cooking Our Website.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-6 text-lg text-gray-500 max-w-lg leading-relaxed"
                >
                    We are going to launch our website Very Soon.
                    <br />
                    Stay Tuned.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-10"
                >
                    <button className="group relative inline-flex items-center gap-3 bg-[#0f172a] text-white pl-2 pr-8 py-2 rounded-full shadow-xl hover:bg-[#1e293b] transition-all hover:scale-105 active:scale-95">
                        <div className="bg-white text-[#0f172a] p-2 rounded-full">
                            <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Notify Me &gt;</span>
                    </button>
                </motion.div>
            </div>

            {/* Social Icons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-10 flex gap-4"
            >
                {[Globe, Instagram, Linkedin].map((Icon, i) => (
                    <button key={i} className="p-3 rounded-full bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-[#1a56db] hover:shadow-md transition-all">
                        <Icon className="w-5 h-5" />
                    </button>
                ))}
            </motion.div>
        </div>
    );
}
