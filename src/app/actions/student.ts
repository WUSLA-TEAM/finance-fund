"use server";

import { prisma } from "@/lib/db";

export async function getStudentDetails(studentId: string) {
    if (!studentId) return null;

    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                department: true,
                contributions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        return student;
    } catch (error) {
        console.error("Error fetching student details:", error);
        return null;
    }
}
