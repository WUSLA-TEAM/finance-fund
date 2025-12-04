"use client";

import { useState, useEffect } from "react";
import { HeroStats } from "@/components/hero-stats";
import { DepartmentList } from "@/components/department-list";
import { StudentTable } from "@/components/student-table";

interface DashboardData {
    stats: {
        totalCollected: number;
        goal: number;
        topStudents: any[];
        dailyStats: any[];
    };
    departments: any[];
    students: any[];
}

interface DashboardViewProps {
    initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
    const [data, setData] = useState<DashboardData>(initialData);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const newData = await res.json();
                    setData(newData);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000); // Refresh every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-grid">
            <HeroStats
                totalCollected={data.stats.totalCollected}
                goal={data.stats.goal}
                topStudents={data.stats.topStudents}
                dailyStats={data.stats.dailyStats}
            />
            <DepartmentList departments={data.departments} />
            <StudentTable students={data.students} />
        </div>
    );
}
