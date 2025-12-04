"use client";

import { motion } from "framer-motion";
import { Users, ChevronRight, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Department {
    id: string;
    name: string;
    totalCollected: number;
    target: number;
    studentCount: number;
}

interface DepartmentListProps {
    departments: Department[];
}

export function DepartmentList({ departments }: DepartmentListProps) {
    return (
        <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Active Departments</h2>
                <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept, index) => {
                    const percentage = Math.min((dept.totalCollected / dept.target) * 100, 100);

                    // Determine Club
                    let club = "Base";
                    let clubStyles = "border-transparent hover:border-blue-100";
                    let badgeColor = "bg-gray-100 text-gray-600";
                    let iconColor = "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white";

                    if (percentage >= 100) {
                        club = "Centenary Club";
                        clubStyles = "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-gradient-to-br from-white to-purple-50";
                        badgeColor = "bg-purple-100 text-purple-700";
                        iconColor = "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white";
                    } else if (percentage >= 75) {
                        club = "Platinum Club";
                        clubStyles = "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-gradient-to-br from-white to-cyan-50";
                        badgeColor = "bg-cyan-100 text-cyan-700";
                        iconColor = "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white";
                    } else if (percentage >= 50) {
                        club = "Golden Club";
                        clubStyles = "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-gradient-to-br from-white to-yellow-50";
                        badgeColor = "bg-yellow-100 text-yellow-700";
                        iconColor = "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white";
                    } else if (percentage >= 25) {
                        club = "Silver Club";
                        clubStyles = "border-slate-400/50 shadow-[0_0_15px_rgba(148,163,184,0.3)] bg-gradient-to-br from-white to-slate-50";
                        badgeColor = "bg-slate-200 text-slate-700";
                        iconColor = "bg-slate-200 text-slate-600 group-hover:bg-slate-600 group-hover:text-white";
                    }

                    return (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/department/${dept.id}`}>
                                <div className={`content-panel group cursor-pointer transition-all duration-300 border ${clubStyles}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${iconColor}`}>
                                            <Users size={20} />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${badgeColor}`}>
                                                <TrendingUp size={12} />
                                                <span>{percentage.toFixed(0)}%</span>
                                            </div>
                                            {percentage >= 25 && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{club}</span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                                        {dept.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {dept.studentCount} Students • Target: ₹{(dept.target / 1000).toFixed(0)}k
                                    </p>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Collected</p>
                                            <p className="text-xl font-bold text-gray-900">₹{dept.totalCollected.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
