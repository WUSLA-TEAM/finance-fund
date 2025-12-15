"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { getStudentDetails } from "@/app/actions/student";
import { format as formatDate } from "date-fns";
import { Loader2, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle, Pencil, X, Check } from "lucide-react";
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

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleStartEdit = (contribution: any) => {
        setEditingId(contribution.id);
        setEditValue(contribution.reference || "");
    };

    const handleSaveEdit = async (contributionId: string) => {
        if (!editValue.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/update-contribution", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contributionId, reference: editValue }),
            });

            if (res.ok && student) {
                const updatedContributions = student.contributions.map(c =>
                    c.id === contributionId ? { ...c, reference: editValue } : c
                );
                setStudent({ ...student, contributions: updatedContributions });
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update contribution", error);
        } finally {
            setIsSaving(false);
        }
    };

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
                                            className="group flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 hover:bg-secondary/50 transition-colors"
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
                                                    {isAdmin && !editingId && (
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {contribution.reference ? (
                                                                <p className="text-xs text-blue-400">
                                                                    Ref: {contribution.reference}
                                                                </p>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground/50 italic">No reference</span>
                                                            )}

                                                            <button
                                                                onClick={() => handleStartEdit(contribution)}
                                                                className="text-muted-foreground hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                                title={contribution.reference ? "Edit Reference" : "Add Reference"}
                                                            >
                                                                <Pencil size={10} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {editingId === contribution.id && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input
                                                                type="text"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                className="text-xs bg-black/20 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-white/30 w-full min-w-[150px]"
                                                                placeholder="Enter reference..."
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleSaveEdit(contribution.id)}
                                                                disabled={isSaving}
                                                                className="text-green-400 hover:text-green-300"
                                                            >
                                                                <Check size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingId(null)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
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
