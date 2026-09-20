import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const quotation = await prisma.quotations.findUnique({
            where: { id: Number(id) },
            include: {
                quotationItem: {
                    include: {
                        equipment: true
                    }
                }
            }
        })

        if (!quotation) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

        return NextResponse.json({ message: "Quotation fetched successfully", quotation }, { status: 200 });
    } catch (error) {
        console.error("Error fetching quotation:", error);
        return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id:string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Quotation ID is required" }, { status: 400 });
        
        await prisma.quotations.delete({where: { id: Number(id) }})
        return NextResponse.json({ message: "Quotation deleted successfully" }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting quotation:", error);
        return NextResponse.json({ error: "Failed to delete quotation" }, { status: 500 });
    }
}
