"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { getStudentDetails } from "@/app/actions/student";
import { format as formatDate } from "date-fns";
import { Loader2, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StudentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string | null;
    isAdmin: boolean;
}

interface StudentDetails {
    id: string;
    name: string;
    admissionNumber: string | null;
    amountPaid: number;
    target: number;
    status: string;
    contributions: {
        id: string;
        amount: number;
        createdAt: Date;
        reference: string | null;
    }[];
}

export function StudentDetailsModal({ isOpen, onClose, studentId, isAdmin }: StudentDetailsModalProps) {
    const [student, setStudent] = useState<StudentDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && studentId) {
            setLoading(true);
            getStudentDetails(studentId)
                .then((data: any) => {
                    setStudent(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setStudent(null);
        }
    }, [isOpen, studentId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-500 bg-green-500/10';
            case 'PARTIAL': return 'text-yellow-500 bg-yellow-500/10';
            default: return 'text-red-500 bg-red-500/10';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Student Details">
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-muted-foreground" size={32} />
                    </div>
                ) : student ? (
                    <>
                        {/* Header Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</span>
                                <div className="text-2xl font-bold mt-1 text-primary">
                                    {formatCurrency(student.amountPaid)}
                                </div>
                                <div className="mt-2 text-xs flex items-center gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Remaining</span>
                                <div className="text-2xl font-bold mt-1">
                                    {Math.max(student.target - student.amountPaid, 0) === 0
                                        ? "Paid!"
                                        : formatCurrency(Math.max(student.target - student.amountPaid, 0))}
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    Target: {formatCurrency(student.target)}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / History */}
                        <div>
                            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                                <Clock size={16} />
                                Payment History
                            </h4>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {student.contributions.length > 0 ? (
                                    student.contributions.map((contribution, idx) => (
                                        <motion.div
                                            key={contribution.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 hover:bg-secondary/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                    <TrendingUp size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Payment Received</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar size={10} />
                                                        {formatDate(new Date(contribution.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                                    </p>
                                                    {isAdmin && contribution.reference && (
                                                        <p className="text-xs text-blue-400 mt-0.5">
                                                            Ref: {contribution.reference}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-bold text-green-500">
                                                +{formatCurrency(contribution.amount)}
                                            </span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                                        <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                                        <p className="text-sm">No payment history found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-red-400">
                        Failed to load student details
                    </div>
                )}
            </div>
        </Modal>
    );
}
