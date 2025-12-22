"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { RollingNumber } from "@/components/ui/rolling-number";

interface DashboardData {
    stats: {
        totalCollected: number;
        goal: number;
        topStudents: {
            id: string;
            name: string;
            admissionNumber?: string | null;
            amount: number;
            department: string;
        }[];
        dailyStats: {
            day: string;
            amount: number;
        }[];
    };
    departments: {
        id: string;
        name: string;
        totalCollected: number;
        target: number;
        studentCount: number;
    }[];
    students: {
        id: string;
        name: string;
        amountPaid: number;
        target: number;
        status: string;
        department: {
            name: string;
        };
    }[];
}

interface MainContentProps {
    data: DashboardData;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function MainContent({ data }: MainContentProps) {
    const { stats, departments } = data;
    const progressPercentage = Math.min((stats.totalCollected / stats.goal) * 100, 100);

    // Sort departments by collected amount
    const sortedDepts = [...departments]
        .sort((a, b) => b.totalCollected - a.totalCollected);

    return (
        <main className="main-content relative z-10">
            {/* Background Liquid Effects */}
            {/* Removed liquid effects for cleaner branding */}

            {/* Welcome Section */}
            <motion.div
                className="welcome-section mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Fund Overview
                    </h1>
                    <p className="text-sm text-[#A7A7A7] font-medium tracking-wide">Live Collection Monitor</p>
                </div>
            </motion.div>

            {/* MAIN BALANCE CARD - Branding Gradient */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-[24px] p-8 mb-8 shadow-2xl group bg-brand-gradient"
            >
                {/* Subtle Grain Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shine_4s_infinite]" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-xs font-bold text-white/90 uppercase tracking-widest">
                        Total Collected
                    </div>

                    <motion.div
                        className="my-3"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-lg">
                            <RollingNumber value={stats.totalCollected} prefix="₹" />
                        </h2>
                    </motion.div>

                    <div className="text-sm font-bold text-white/80 mb-6 flex items-center gap-3">
                        <span>Goal: {formatCurrency(stats.goal)}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/10">
                            {progressPercentage.toFixed(1)}%
                        </span>
                    </div>

                    {/* Progress Bar - White on Orange */}
                    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)] relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Contributors: Clean Dark Cards */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-white">Top Contributors</h2>
                    <span className="text-xs text-[#E85002] font-bold uppercase tracking-wider cursor-pointer hover:text-[#FF6010] transition-colors">View All</span>
                </div>

                {/* Mobile Scroll */}
                <div className="relative md:hidden -mx-4 group">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black via-black/90 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black via-black/90 to-transparent z-20 pointer-events-none" />

                    <div className="flex overflow-x-auto gap-4 pb-6 px-10 scrollbar-hide snap-x intro-x">
                        {stats.topStudents.map((student, index) => (
                            <motion.div
                                key={`mobile-contrib-${student.id}`}
                                className={`min-w-[240px] relative rounded-2xl overflow-hidden snap-center group brand-card`}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="relative z-10 p-5 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${index === 0 ? 'bg-gradient-to-br from-[#E85002] to-[#C10801] text-white border-[#E85002]' :
                                            index < 3 ? 'bg-[#222] text-white border-[#333]' :
                                                'bg-[#111] text-[#666] border-[#222]'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase font-bold text-[#646464] tracking-wider">Amount</div>
                                            <div className="text-lg font-bold text-white font-mono">
                                                {formatCurrency(student.amount)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <h3 className="font-bold text-white text-base mb-0.5 truncate">{student.name}</h3>
                                        <p className="text-[11px] text-[#A7A7A7] font-bold uppercase tracking-wide truncate">{student.department}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Desktop List - Liquid Glass Effect */}
                <div className="contributors-card hidden md:block liquid-glass-card rounded-[24px] overflow-hidden backdrop-blur-xl">
                    {/* Header for Liquid Card */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                        <h3 className="font-bold text-white tracking-wide text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#E85002] animate-pulse" />
                            Top Performers
                        </h3>
                        <span className="text-[10px] font-bold text-[#646464] uppercase tracking-widest">Live Ranking</span>
                    </div>

                    {stats.topStudents.slice(0, 5).map((student, index) => (
                        <motion.div
                            key={student.id}
                            className="contributor-row hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 p-4 flex items-center group relative overflow-hidden"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 5 }}
                        >
                            {/* Hover Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E85002]/0 via-[#E85002]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mr-4 shadow-lg ${index === 0 ? 'bg-gradient-to-br from-[#E85002] to-[#C10801] text-white border border-[#E85002] shadow-[0_0_15px_rgba(232,80,2,0.4)]' :
                                    index < 3 ? 'bg-[#222] text-white border border-[#444]' :
                                        'bg-[#111] text-[#646464] border border-[#222]'
                                }`}>
                                {index + 1}
                            </div>

                            <div className="contributor-avatar w-9 h-9 rounded-full bg-black border border-white/10 text-[#A7A7A7] font-bold flex items-center justify-center text-xs mr-3 shadow-inner">
                                {student.name.charAt(0)}
                            </div>

                            <div className="contributor-info flex-1 relative z-10">
                                <span className="contributor-name font-bold text-white block text-sm group-hover:text-[#E85002] transition-colors">{student.name}</span>
                                <span className="contributor-dept text-[10px] text-[#646464] uppercase font-bold tracking-wider">{student.department}</span>
                            </div>

                            <div className="text-right relative z-10">
                                <span className="contributor-amount font-mono font-black text-white text-sm block drop-shadow-md">{formatCurrency(student.amount)}</span>
                                {index === 0 && <span className="text-[9px] text-[#E85002] uppercase font-bold tracking-widest">Leader</span>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Departments: Unified Branding Style */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <div className="flex justify-between items-end mb-4 px-1">
                    <h2 className="text-lg font-bold text-white">Departments</h2>
                    <span className="text-xs font-bold text-[#646464] hover:text-white cursor-pointer px-3 py-1 rounded-full border border-[#333] transition-colors">Overall Status</span>
                </div>

                {/* Unified Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 pb-4">
                    {sortedDepts.map((dept, index) => {
                        const target = dept.studentCount * 5000;
                        const percentage = target > 0 ? Math.min((dept.totalCollected / target) * 100, 100) : 0;

                        return (
                            <Link
                                href={`/department/${dept.id}`}
                                key={dept.id}
                                className="block brand-card p-5 rounded-2xl transition-all group relative overflow-hidden"
                            >
                                {/* Rich Gradient Glow on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E85002]/0 via-transparent to-transparent group-hover:from-[#E85002]/10 transition-colors duration-500" />

                                {/* Metallic Highlight */}
                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                <div className="flex flex-col h-full justify-between relative z-10">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 min-h-[2.5em] group-hover:text-[#E85002] transition-colors tracking-wide">{dept.name}</h3>
                                            <div className="w-8 h-8 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#646464] group-hover:text-white group-hover:border-[#E85002] transition-all shadow-inner">
                                                <TrendingUp size={14} />
                                            </div>
                                        </div>
                                        <p className="font-black text-white font-mono text-xl mb-1 tracking-tight drop-shadow-md">{formatCurrency(dept.totalCollected)}</p>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between text-[10px] text-[#A7A7A7] mb-2 font-bold uppercase tracking-wider">
                                            <span>{percentage.toFixed(0)}% Complete</span>
                                        </div>
                                        {/* Progress Bar - Rich Orange Gradient */}
                                        <div className="w-full h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#222] shadow-inner">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#C10801] to-[#E85002] shadow-[0_0_10px_rgba(232,80,2,0.4)]"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </main>
    );
}
