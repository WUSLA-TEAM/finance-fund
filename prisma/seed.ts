import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEPARTMENTS = [
    "Computer Science",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics",
    "Business Administration"
];

async function main() {
    console.log('Start seeding ...');

    for (const deptName of DEPARTMENTS) {
        const dept = await prisma.department.upsert({
            where: { name: deptName },
            update: {},
            create: { name: deptName },
        });

        console.log(`Created department: ${dept.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
