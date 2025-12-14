
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
    try {
        const studentCount = await prisma.student.count();
        const deptCount = await prisma.department.count();
        console.log(`DATA_CHECK_RESULT: Students: ${studentCount}, Departments: ${deptCount}`);
    } catch (error) {
        console.error("DATA_CHECK_ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
