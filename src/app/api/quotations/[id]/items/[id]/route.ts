import { calculateSubTotal } from "../../../route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


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


// update quotation item (only 'quantity')
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; itemId: string }> }
) {
    try {
        const { id, itemId } = await params;
        const quotationId = Number(id);
        const quotationItemId = Number(itemId);

        if (!quotationId || !quotationItemId) {
            return NextResponse.json({
                error: "Quotation ID and Item ID are required"
            }, { status: 400 });
        }

        const { quantity } = await request.json();
        if (!quantity || quantity <= 0) {
            return NextResponse.json(
                { error: "Quantity must be greater than 0" },
                { status: 400 }
            );
        }

        const quotationItem = await prisma.quotationItem.findFirst({  // Find quotation item 
            where: {
                id: quotationItemId,
                quotationId: quotationId,
            },
            include: {
                equipment: true,
            },
        });
        if (!quotationItem) return NextResponse.json({ error: "Quotation item not found" }, { status: 404 });

        const subtotal = calculateSubTotal(quantity, quotationItem.equipment.unitPrice);
        await prisma.quotationItem.update({
            where: {
                id: quotationItemId,
            },
            data: {
                quantity,
                subtotal,
            },
        });

        // Get all quotationItems of this quotation
        const allItems = await prisma.quotationItem.findMany({ where: { quotationId } });

        // Recalculate quotation total
        const totalPrice = allItems.reduce(
            (total, item) => total + (item.id === quotationItemId ? subtotal : item.subtotal), 0
        );

        // Update quotation total
        const quotation = await prisma.quotations.update({
            where: {
                id: quotationId,
            },
            data: {
                totalPrice,
            },
            include: {
                quotationItem: {
                    include: {
                        equipment: true,
                    },
                },
            },
        });
        return NextResponse.json({ message: "Quotation item updated successfully", quotation }, { status: 200 });

    } catch (error) {
        console.error("Error updating quotation item:", error);
        return NextResponse.json({ error: "Failed to update quotation item" }, { status: 500 });
    }
}




export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; itemId: string }> }
) {
    try {
        const { id, itemId } = await params;
        const quotationId = Number(id);
        const quotationItemId = Number(itemId);

        if (!quotationId || !quotationItemId) {
            return NextResponse.json({
                error: "Quotation ID and Item ID are required"
            }, { status: 400 });
        }

        const quotationItem = await prisma.quotationItem.findUnique({ where: { id: quotationItemId } })
        if (!quotationItem) return NextResponse.json({ error: "Quotation item not found" },{ status: 404 });

        // Delete + Update total
        const quotation = await prisma.$transaction([  // transaction: both works or both fails
            prisma.quotationItem.delete({ where: { id: quotationItemId } }),
            prisma.quotations.update({
                where: { id: quotationId },
                data: {
                    totalPrice: {
                        decrement: quotationItem.subtotal
                    }
                }
            })
        ]);
        return NextResponse.json({ message: "Quotation item updated successfully", quotation }, { status: 200 });

    } catch (error) {
        console.error("Error updating quotation item:", error);
        return NextResponse.json({ error: "Failed to update quotation item" }, { status: 500 });
    }
}






