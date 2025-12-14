"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { StudentDetailsModal } from "./student-details-modal";

interface Student {
    id: string;
    admissionNumber: string | null;
    name: string;
    amountPaid: number;
    target: number;
    status: string;
}

interface StudentListProps {
    students: Student[];
    isAdmin: boolean;
}

export function StudentList({ students, isAdmin }: StudentListProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleStudentClick = (id: string) => {
        setSelectedStudentId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="students-section">
            <h2 className="section-title">Students ({students.length})</h2>
            <div className="students-list">
                {students.map((student, index) => {
                    const studentProgress = Math.min((student.amountPaid / 5000) * 100, 100);
                    const status = student.amountPaid >= 5000 ? 'completed' : student.amountPaid > 0 ? 'partial' : 'pending';

                    return (
                        <div
                            key={student.id}
                            className="student-row cursor-pointer hover:bg-secondary/40 transition-colors"
                            onClick={() => handleStudentClick(student.id)}
                        >
                            <div className="student-rank">{index + 1}</div>
                            <div className="student-avatar">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-info">
                                <span className="student-name">{student.name}</span>
                                <span className="text-xs text-muted-foreground">{student.admissionNumber}</span>
                                <div className="student-progress-bar">
                                    <div
                                        className="student-progress-fill"
                                        style={{ width: `${studentProgress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="student-amount-section">
                                <span className="student-amount">{formatCurrency(student.amountPaid)}</span>
                                <span className={`student-status ${status}`}>
                                    {status === 'completed' ? '✓ Complete' : status === 'partial' ? 'Partial' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {students.length === 0 && (
                    <div className="empty-state">
                        <Users size={48} />
                        <p>No students in this department yet</p>
                    </div>
                )}
            </div>

            <StudentDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentId={selectedStudentId}
                isAdmin={isAdmin}
            />
        </div>
    );
}
