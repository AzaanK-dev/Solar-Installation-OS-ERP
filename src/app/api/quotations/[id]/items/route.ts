import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateSubTotal } from "../../route";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const quotationId = Number(id);
        if (!quotationId) {
            return NextResponse.json(
                { error: "Quotation ID is required" },
                { status: 400 }
            );
        }

        const { equipmentId, quantity } = await request.json();

        if (!equipmentId || !quantity || quantity <= 0) {
            return NextResponse.json(
                { error: "Equipment ID and valid quantity are required" },
                { status: 400 }
            );
        } 
        const equipment = await prisma.equipment.findUnique({where: { id: Number(equipmentId) }});
        if (!equipment) return NextResponse.json({ error: "Equipment not found" },{ status: 404 });

        const subtotal = calculateSubTotal(Number(quantity), equipment.unitPrice);

        // Add item + update total
        const result = await prisma.$transaction([
            prisma.quotationItem.create({
                data: {
                    quotationId,
                    equipmentId: Number(equipmentId),
                    quantity: Number(quantity),
                    unitPrice: equipment.unitPrice,
                    subtotal
                }
            }),
            prisma.quotations.update({
                where: { id: quotationId },
                data: {
                    totalPrice: {
                        increment: subtotal
                    }
                }
            })
        ]);

        return NextResponse.json({message: "Quotation item added successfully",result},{ status: 201 });

    } catch (error) {
        console.error("Error adding quotation item:", error);
        return NextResponse.json(
            { error: "Failed to add quotation item" },
            { status: 500 }
        );
    }
}