"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Department {
    id: string;
    name: string;
    _count?: {
        students: number;
    };
}

interface DepartmentManagerProps {
    departments: Department[];
}

export function DepartmentManager({ departments }: DepartmentManagerProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the department AND ALL its students and contributions. This cannot be undone.")) {
            return;
        }

        setIsDeleting(id);
        try {
            const res = await fetch("/api/admin/department", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.error}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="bento-card p-8 border-red-500/20">
            <div className="flex items-center gap-2 mb-6 text-red-400">
                <Building2 size={20} />
                <h3 className="text-xl font-bold">Manage Departments</h3>
            </div>

            <div className="space-y-4">
                {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <div>
                            <h4 className="font-bold text-white">{dept.name}</h4>
                            <p className="text-sm text-slate-400">
                                {dept._count?.students || 0} Students
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(dept.id)}
                            disabled={isDeleting === dept.id}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Department"
                        >
                            {isDeleting === dept.id ? (
                                <span className="text-xs">...</span>
                            ) : (
                                <Trash2 size={18} />
                            )}
                        </button>
                    </div>
                ))}

                {departments.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No departments found.
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-red-500/5 rounded-xl border border-red-500/10 flex gap-3 text-sm text-red-300/80">
                <AlertTriangle size={20} className="shrink-0" />
                <p>Deleting a department will permanently remove all associated student records and financial data. Proceed with caution.</p>
            </div>
        </div>
    );
}
