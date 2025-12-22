"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft } from "lucide-react";

interface Student {
    id: string;
    name: string;
    amountPaid: number;
    target: number;
    status: string;
    department: {
        name: string;
    };
}

interface TransactionsPanelProps {
    students: Student[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function getDateLabel(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
}

export function TransactionsPanel({ students }: TransactionsPanelProps) {
    return (
        <aside className="h-full relative z-10">
            <div className="glass-panel h-full p-6 relative overflow-hidden flex flex-col">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Activity</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{getDateLabel()}</p>
                    </div>
                </div>

                {/* Activity List */}
                <motion.div
                    className="flex-1 overflow-y-auto -mx-4 px-4 space-y-3 custom-scrollbar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {students.slice(0, 10).map((student, index) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 hover:bg-white/60 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center border border-green-200/50 shadow-sm group-hover:scale-110 transition-transform">
                                    <ArrowDownLeft size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">{student.name}</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{student.department.name}</p>
                                </div>
                            </div>
                            <span className="font-mono font-bold text-green-600 dark:text-green-400 text-sm">
                                +{formatCurrency(student.amountPaid)}
                            </span>
                        </motion.div>
                    ))}

                    {students.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm opacity-60">
                            <p>No recent activity</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </aside>
    );
}
