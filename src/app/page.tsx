import { prisma } from "@/lib/db";
import { HeroStats } from "@/components/hero-stats";
import { DepartmentList } from "@/components/department-list";
import { StudentTable } from "@/components/student-table";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  // 1. Stats (Hero)
  const totalCollectedAgg = await prisma.student.aggregate({ _sum: { amountPaid: true } });
  const totalTargetAgg = await prisma.student.aggregate({ _sum: { target: true } });

  const totalCollected = totalCollectedAgg._sum.amountPaid || 0;
  const goal = totalTargetAgg._sum.target || 0;

  // 2. Top Students
  const groupedStudents = await prisma.student.groupBy({
    by: ['name', 'departmentId'],
    _sum: { amountPaid: true },
    orderBy: { _sum: { amountPaid: 'desc' } },
    take: 5,
  });

  const departmentIds = groupedStudents.map(s => s.departmentId).filter((id): id is string => id !== null);
  const deptNames = await prisma.department.findMany({
    where: { id: { in: departmentIds } },
    select: { id: true, name: true }
  });
  const deptMap = new Map(deptNames.map(d => [d.id, d.name]));

  const topStudents = groupedStudents.map((s, index) => ({
    id: `${s.name}-${s.departmentId}-${index}`,
    name: s.name,
    amount: s._sum.amountPaid || 0,
    department: deptMap.get(s.departmentId) || 'Unknown',
  }));

  // 3. Daily Stats
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const contributions = await prisma.contribution.groupBy({
    by: ['createdAt'],
    _sum: { amount: true },
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  const dailyMap = new Map<string, number>();
  contributions.forEach((c: any) => {
    const day = c.createdAt.toISOString().split('T')[0];
    dailyMap.set(day, (dailyMap.get(day) || 0) + (c._sum.amount || 0));
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyStats = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dailyStats.push({
      day: days[d.getDay()],
      amount: dailyMap.get(dateStr) || 0,
    });
  }

  // 4. Departments
  const departmentsData = await prisma.department.findMany({
    include: { students: true },
    orderBy: { name: 'asc' }
  });

  const departments = departmentsData.map((dept: any) => {
    const studentCount = dept.students.length;
    const target = studentCount * 5000;
    const collected = dept.students.reduce((acc: number, s: any) => acc + s.amountPaid, 0);

    return {
      id: dept.id,
      name: dept.name,
      totalCollected: collected,
      target: target > 0 ? target : 5000,
      studentCount: studentCount,
    };
  });

  // 5. Recent Students (Activity)
  const recentStudents = await prisma.student.findMany({
    include: { department: { select: { name: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return {
    stats: { totalCollected, goal, topStudents, dailyStats },
    departments,
    students: recentStudents
  };
}

export default async function Home() {
  const initialData = await getDashboardData();

  return (
    <main className="min-h-screen pb-12">
      <DashboardView initialData={initialData} />
    </main>
  );
}
