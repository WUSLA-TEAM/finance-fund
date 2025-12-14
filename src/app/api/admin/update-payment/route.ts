
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/file-upload";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const studentId = formData.get("studentId") as string;
        const amountStr = formData.get("amount") as string;
        const reference = formData.get("reference") as string;
        const file = formData.get("file") as File | null;

        if (!studentId) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        const amount = Number(amountStr);
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
        }

        // Get current student
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { amountPaid: true, target: true }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Handle file upload
        let referenceValue = reference || null;
        if (file && file.size > 0) {
            const savedPath = await saveFile(file, "receipts");
            if (savedPath) {
                // If there's already a text reference, maybe append? 
                // For now, let's treat reference as "Note" and if file exists, we can prepend/append filename or just use file path if ref is empty
                if (referenceValue) {
                    referenceValue = `${referenceValue} (File: ${savedPath})`;
                } else {
                    referenceValue = `File: ${savedPath}`;
                }
            }
        }

        // Calculate new total
        const newTotal = student.amountPaid + amount;

        // Determine new status
        let newStatus = "PARTIAL";
        if (newTotal >= student.target) {
            newStatus = "COMPLETED";
        } else if (newTotal === 0) {
            newStatus = "PENDING";
        }

        // Update student
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                amountPaid: newTotal,
                status: newStatus,
            },
            select: { amountPaid: true, status: true }
        });

        // Create contribution record with reference
        await prisma.contribution.create({
            data: {
                amount: amount,
                studentId: studentId,
                // @ts-ignore
                reference: referenceValue
            },
        });

        return NextResponse.json({
            success: true,
            message: "Payment updated successfully",
            previousAmount: student.amountPaid,
            addedAmount: amount,
            newTotal: updatedStudent.amountPaid,
            status: newStatus,
            reference: referenceValue
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }
}
