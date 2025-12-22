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
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Welcome Section */}
            <motion.div
                className="welcome-section mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Fund Overview
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track collection progress</p>
                </div>
            </motion.div>

            {/* Liquid Glass Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-[28px] p-8 mb-8 shadow-2xl group"
            >
                {/* Glass Background */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 dark:bg-black/20 z-0" />

                {/* Animated Gradient Mesh */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-amber-500 via-purple-500 to-blue-500 blur-2xl group-hover:opacity-30 transition-opacity duration-700" />

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shine_4s_infinite]" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-700 dark:text-gray-200">
                        Total Collected
                    </div>

                    <motion.div
                        className="my-2"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white drop-shadow-sm">
                            <RollingNumber value={stats.totalCollected} prefix="₹" />
                        </h2>
                    </motion.div>

                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-6 flex items-center gap-2">
                        <span>Goal: {formatCurrency(stats.goal)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${progressPercentage >= 100 ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'}`}>
                            {progressPercentage.toFixed(1)}%
                        </span>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="w-full h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden p-[2px] backdrop-blur-sm">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Contributors: Glass Carousel */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Top Contributors</h2>
                    <span className="text-xs text-amber-600 font-semibold cursor-pointer">View All</span>
                </div>

                {/* Mobile Scroll */}
                <div className="md:hidden flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 scrollbar-hide snap-x intro-x">
                    {stats.topStudents.map((student, index) => (
                        <motion.div
                            key={`mobile-contrib-${student.id}`}
                            className="min-w-[260px] relative rounded-2xl overflow-hidden snap-center group"
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Glass Background */}
                            <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-white/5" />

                            <div className="relative z-10 p-5 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950' :
                                        index === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-300 to-red-400 text-red-950' :
                                                'bg-gray-100 text-gray-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Amount</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                                            {formatCurrency(student.amount)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 truncate">{student.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{student.department}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {stats.topStudents.length === 0 && (
                        <div className="w-full text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No contributions yet</div>
                    )}
                </div>

                {/* Desktop List (Hidden Mobile) */}
                <div className="contributors-card hidden md:block bg-white/50 backdrop-blur-lg border border-white/20">
                    {stats.topStudents.slice(0, 5).map((student, index) => (
                        <motion.div
                            key={student.id}
                            className="contributor-row hover:bg-white/40 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="contributor-rank">{index + 1}</div>
                            <div className="contributor-avatar font-bold text-white bg-gradient-to-br from-gray-800 to-black">
                                {student.name.charAt(0)}
                            </div>
                            <div className="contributor-info">
                                <span className="contributor-name font-semibold">{student.name}</span>
                                <span className="text-xs text-gray-500">{student.admissionNumber}</span>
                                <span className="contributor-dept">{student.department}</span>
                            </div>
                            <span className="contributor-amount font-mono font-bold text-gray-800">{formatCurrency(student.amount)}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Departments - Clean Minimal Grid/Scroll */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <div className="flex justify-between items-end mb-4 px-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Departments</h2>
                    <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">Overall Status</span>
                </div>

                {/* Unified Grid Layout (Mobile: 2 cols, Desktop: 3 cols) */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 pb-4">
                    {sortedDepts.map((dept, index) => {
                        const target = dept.studentCount * 5000;
                        const percentage = target > 0 ? Math.min((dept.totalCollected / target) * 100, 100) : 0;

                        // Visual Interest: Department Accent Colors
                        const accentColor = index % 5 === 0 ? 'border-emerald-500' :
                            index % 5 === 1 ? 'border-indigo-500' :
                                index % 5 === 2 ? 'border-amber-500' :
                                    index % 5 === 3 ? 'border-blue-500' : 'border-rose-500';

                        const barColor = index % 5 === 0 ? 'bg-emerald-500' :
                            index % 5 === 1 ? 'bg-indigo-500' :
                                index % 5 === 2 ? 'bg-amber-500' :
                                    index % 5 === 3 ? 'bg-blue-500' : 'bg-rose-500';

                        return (
                            <Link
                                href={`/department/${dept.id}`}
                                key={dept.id}
                                className={`block bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 ${accentColor} border-y border-r border-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 shadow-sm hover:shadow-md transition-all group`}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight line-clamp-2 min-h-[2.5em]">{dept.name}</h3>
                                            <div className={`p-1.5 rounded-full ${index % 5 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                <TrendingUp size={14} />
                                            </div>
                                        </div>
                                        <p className="font-bold text-slate-900 dark:text-white font-mono text-lg mb-1">{formatCurrency(dept.totalCollected)}</p>
                                    </div>

                                    <div className="mt-2">
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                                            <span>{dept.studentCount} Students</span>
                                            <span>{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${barColor}`}
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
