
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const isAuth = await checkAuth("admin");
        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const departmentId = formData.get("departmentId") as string;

        if (!file || !departmentId) {
            return NextResponse.json({ error: "Missing file or department" }, { status: 400 });
        }

        // Read file content
        const text = await file.text();
        const lines = text.split('\n');

        // Skip header if it exists (assuming Name,AdmissionNumber,AmountPaid)
        const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

        let successCount = 0;
        let errorCount = 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [name, admissionNumber, amountPaidStr] = line.split(',');

            if (!name) {
                errorCount++;
                continue;
            }

            try {
                // Determine status based on amount (logic from seed/manual)
                const amountPaid = amountPaidStr ? parseFloat(amountPaidStr) : 0;
                const paddedAmount = isNaN(amountPaid) ? 0 : amountPaid;
                const status = paddedAmount >= 5000 ? "COMPLETED" : paddedAmount > 0 ? "PARTIAL" : "PENDING";

                await prisma.student.create({
                    data: {
                        name: name.trim(),
                        admissionNumber: admissionNumber?.trim() || null,
                        amountPaid: paddedAmount,
                        status: status,
                        departmentId: departmentId,
                    }
                });
                successCount++;
            } catch (err) {
                console.error(`Failed to import line ${i + 1}:`, line, err);
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            count: successCount,
            errors: errorCount,
            message: `Successfully imported ${successCount} students${errorCount > 0 ? ` with ${errorCount} errors` : ''}`
        });

    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
