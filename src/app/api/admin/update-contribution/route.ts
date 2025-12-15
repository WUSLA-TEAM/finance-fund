
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { contributionId, reference } = await request.json();

        if (!contributionId) {
            return NextResponse.json({ error: "Contribution ID is required" }, { status: 400 });
        }

        // Verify contribution exists
        const contribution = await prisma.contribution.findUnique({
            where: { id: contributionId },
        });

        if (!contribution) {
            return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
        }

        // Update contribution
        const updatedContribution = await prisma.contribution.update({
            where: { id: contributionId },
            data: {
                reference: reference || null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Contribution updated successfully",
            updatedContribution,
        });
    } catch (error) {
        console.error("Error updating contribution:", error);
        return NextResponse.json({ error: "Failed to update contribution" }, { status: 500 });
    }
}
