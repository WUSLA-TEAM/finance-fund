import { prisma } from "@/lib/db";
import { StudentTable } from "@/components/student-table";
import { ShieldAlert, Database } from "lucide-react";

export const dynamic = "force-dynamic";

import { DepartmentManager } from "@/components/admin/department-manager";

async function getAllStudents() {
    try {
        const students = await prisma.student.findMany({
            include: {
                department: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return students;
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return [];
    }
}

async function getAllDepartments() {
    try {
        return await prisma.department.findMany({
            include: {
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Failed to fetch departments:", error);
        return [];
    }
}

export default async function DeveloperPage() {
    const students = await getAllStudents();
    const departments = await getAllDepartments();

    return (
        <main className="min-h-screen py-12 bg-slate-950">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <Database className="text-red-500" size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">
                            Developer Console
                        </h1>
                        <p className="text-slate-400">
                            Advanced data management and system controls. <span className="text-red-400 font-bold">Handle with care.</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bento-card p-8 border-red-500/20">
                            <div className="flex items-center gap-2 mb-6 text-red-400">
                                <ShieldAlert size={20} />
                                <h3 className="text-xl font-bold">Student Data</h3>
                            </div>
                            <StudentTable students={students} className="w-full" />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <DepartmentManager departments={departments} />
                    </div>
                </div>
            </div>
        </main>
    );
}
