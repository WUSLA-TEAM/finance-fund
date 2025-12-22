import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { VibrantDepartmentView } from "@/components/department/vibrant-department-view";

interface DepartmentPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = "force-dynamic";

async function getDepartment(id: string) {
    const department = await prisma.department.findUnique({
        where: { id },
        include: {
            students: {
                orderBy: {
                    amountPaid: "desc",
                },
            },
        },
    });

    if (!department) return null;

    const studentCount = department.students.length;
    const target = studentCount * 5000;
    const totalCollected = department.students.reduce((acc: number, s: { amountPaid: number }) => acc + s.amountPaid, 0);

    return {
        ...department,
        totalCollected,
        target: target > 0 ? target : 5000,
        studentCount // Explicitly pass studentCount
    };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
    const { id } = await params;
    const department = await getDepartment(id);

    if (!department) {
        notFound();
    }

    // Transform department data to match the interface if needed, or rely on TS compatibility
    // The query above matches the shape expected by VibrantDepartmentView (id, name, totalCollected, target, studentCount, students[])

    return <VibrantDepartmentView data={department} />;
}
