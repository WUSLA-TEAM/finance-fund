"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, Activity, Clock } from "lucide-react";

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
    const recentStudents = [...students]
        .filter(s => s.amountPaid > 0)
        .slice(0, 10);

    return (
        <aside className="hidden lg:block w-[360px] p-6 lg:border-l border-[#333] z-20">
            <div className="sticky top-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white tracking-wide">Recent Activity</h2>
                    <div className="p-2 rounded-full bg-[#111] border border-[#333]">
                        <Activity size={18} className="text-[#E85002]" />
                    </div>
                </div>

                <div className="space-y-4">
                    {recentStudents.map((student, i) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="brand-card p-4 rounded-xl flex items-center gap-4 group transition-all cursor-default"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shadow-sm ${i === 0 ? 'bg-gradient-to-br from-[#E85002] to-[#C10801] text-white border-[#E85002]' : 'bg-[#111] border-[#333] text-[#A7A7A7]'
                                }`}>
                                {student.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-sm truncate group-hover:text-[#E85002] transition-colors">
                                    {student.name}
                                </h4>
                                <p className="text-xs text-[#646464] truncate font-bold uppercase">
                                    {student.department.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#E85002] font-mono text-sm">
                                    +{formatCurrency(student.amountPaid)}
                                </p>
                                <p className="text-[10px] text-[#646464] font-bold uppercase">Just now</p>
                            </div>
                        </motion.div>
                    ))}

                    {recentStudents.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <Clock size={32} className="mx-auto mb-2 text-[#646464]" />
                            <p className="text-sm text-[#A7A7A7]">No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
