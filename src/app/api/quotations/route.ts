import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET() {
    try {
        const quotations = await prisma.quotations.findMany();
        if (quotations.length === 0) {
            return NextResponse.json({ error: "No equipment found" }, { status: 404 });
        }
        return NextResponse.json({ message: "All quotations fetched successfully", quotations });
    } catch (error) {
        console.error("Error fetching equipment:", error);
        return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
    }
}

export function calculateSubTotal(qty: number,price: number){
    const subtotal = qty*price;
    return subtotal;
}

export async function POST(request: Request) {
    try {
        const { leadId, items } = await request.json()   // "items": [ {"equipmentId": 2,"quantity": 10}, {},.. ]

        const lead = await prisma.leads.findUnique({ where: { id: Number(leadId) } })
        if (!lead) return NextResponse.json({ error: "lead not found" }, { status: 404 })

        let subtotal: number = 0;
        let totalPrice: number = 0;
        let quotationItems = []
        for (const i of items) {
            const equipment = await prisma.equipment.findUnique({
                where: { id: Number(i.equipmentId) }
            })
            if (!equipment) return NextResponse.json({ error: "Equipment not found for quotation" }, { status: 404 })

            subtotal = calculateSubTotal(i.quantity, equipment.unitPrice);
            totalPrice += subtotal;
            quotationItems.push({
                equipmentId: equipment.id,
                subtotal,
                quantity: i.quantity,
                unitPrice: equipment.unitPrice,
            })
        }

        const quotation = await prisma.quotations.create({
            data: {
                leadId,
                status: "DRAFT",
                totalPrice,
                quotationItem: {   // nested create to connect these quotationItem(s) with quotation
                    create: quotationItems
                }
            }
        })
        return NextResponse.json({ message: "Quotation created successfully", quotation }, { status: 201 });

    } catch (error) {
        console.error("Error creating quotation:", error);
        return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
    }
}

