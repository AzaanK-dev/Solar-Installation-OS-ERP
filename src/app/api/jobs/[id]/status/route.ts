import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// update status of any job:   /api/jobs/:id/status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        
        const { status } = await request.json();
        if (!status) return NextResponse.json({ error: "Status is required" }, { status: 400 });
        if (!["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        const job = await prisma.installationJobs.update({
            where: { id: Number(id) },
            data: { status: status }
        });

        return NextResponse.json({ message: "Job status updated successfully", job }, { status: 200 });
    } catch (error) {
        console.error("Error updating job status:", error);
        return NextResponse.json({ error: "Failed to update job status" }, { status: 500 });
    }
}