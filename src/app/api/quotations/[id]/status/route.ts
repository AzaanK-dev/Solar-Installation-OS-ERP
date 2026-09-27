import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Quotation ID is required" }, { status: 400 });
        
        const { status } = await request.json();
        if (!status) return NextResponse.json({ error: "Status is required" }, { status: 400 });
        if (!["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"].includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }
        
        const quotation = await prisma.quotations.update({
            where: { id: Number(id) },
            data: { status: status }
        });

        return NextResponse.json({ message: "Quotation status updated successfully", quotation }, { status: 200 });
    } catch (error) {
        console.error("Error updating quotation status:", error);
        return NextResponse.json({ error: "Failed to update quotation status" }, { status: 500 });
    }
}