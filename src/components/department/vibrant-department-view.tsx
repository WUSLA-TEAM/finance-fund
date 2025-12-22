"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, TrendingUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
    id: string;
    name: string;
    admissionNumber: string | null;
    amountPaid: number;
    target: number;
    status: string;
}

interface DepartmentData {
    id: string;
    name: string;
    totalCollected: number;
    target: number;
    studentCount: number;
    students: Student[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function VibrantDepartmentView({ data }: { data: DepartmentData }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = data.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.admissionNumber && s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const progress = Math.min((data.totalCollected / data.target) * 100, 100);

    return (
        <main className="min-h-screen pb-20 relative bg-[#000000]">
            {/* Background is handled globally as #000000 */}

            {/* Sticky Header */}
            <motion.div
                className="sticky top-0 z-30 bg-black/95 border-b border-[#333] px-4 py-3 flex items-center gap-3 mb-6 backdrop-blur-md"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-[#222] text-[#A7A7A7] transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-bold text-lg text-white tracking-wide truncate flex-1">{data.name}</h1>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-[#111] border border-[#333] text-[#A7A7A7] uppercase tracking-wider">
                    {data.students.length} Students
                </div>
            </motion.div>

            <div className="p-4 max-w-2xl mx-auto">
                {/* HERO CARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-[24px] p-6 text-white mb-8 relative overflow-hidden bg-brand-gradient shadow-[0_10px_40px_-10px_rgba(232,80,2,0.3)]"
                >
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Circular Progress */}
                        <div className="w-24 h-24 rounded-full relative flex items-center justify-center mb-4 bg-black/20 backdrop-blur-md border border-white/10">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-black/30" />
                                <circle
                                    cx="50%" cy="50%" r="42"
                                    stroke="currentColor" strokeWidth="6"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    className="text-white drop-shadow-md"
                                    strokeDasharray={`${progress * 2.63} 263`}
                                />
                            </svg>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-2xl leading-none text-white drop-shadow-md">{progress.toFixed(0)}%</span>
                            </div>
                        </div>

                        <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-1">Total Collected</p>
                        <h2 className="text-5xl font-black mb-4 tracking-tighter drop-shadow-lg">{formatCurrency(data.totalCollected)}</h2>

                        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">
                            <TrendingUp size={14} className="text-white" />
                            <span className="font-bold text-gray-200">Goal: {formatCurrency(data.target)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative mb-6 group"
                >
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#646464] group-focus-within:text-[#E85002] transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search student name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-[#E85002] focus:ring-1 focus:ring-[#E85002] transition-all font-bold text-white placeholder:text-[#646464] shadow-lg"
                    />
                </motion.div>

                {/* Student List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 500, damping: 30 }}
                                whileTap={{ scale: 0.98 }}
                                className="brand-card p-4 rounded-2xl flex justify-between items-center group hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border ${student.status === 'PAID'
                                            ? 'bg-gradient-to-br from-[#E85002] to-[#C10801] text-white border-[#E85002]'
                                            : 'bg-[#111] text-[#646464] border-[#222]'
                                        } `}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base leading-tight group-hover:text-[#E85002] transition-colors">{student.name}</h3>
                                        <p className="text-xs text-[#646464] font-bold uppercase mt-0.5 flex items-center gap-1">
                                            {student.admissionNumber || 'No ID'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-black font-mono px-2 py-1 rounded-lg ${student.amountPaid > 0
                                            ? 'text-[#E85002]'
                                            : 'text-[#646464]'
                                        } `}>
                                        {formatCurrency(student.amountPaid)}
                                    </div>
                                    {student.status === 'PAID' && (
                                        <div className="flex justify-end mt-1">
                                            <Sparkles size={12} className="text-[#E85002]" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-flex p-4 rounded-full bg-[#111] mb-3 text-[#333]">
                                <Search size={24} />
                            </div>
                            <p className="text-[#646464] font-bold uppercase tracking-widest text-xs">No students found</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
