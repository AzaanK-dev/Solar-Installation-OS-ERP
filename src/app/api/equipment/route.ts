import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const equipment = await prisma.equipment.findMany();
        if (equipment.length === 0) {
            return NextResponse.json({ error: "No equipment found" }, { status: 404 });
        }
        return NextResponse.json({ message: "All equipment fetched successfully", equipment });
    } catch (error) {
        console.error("Error fetching equipment:", error);
        return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const { name, type, quantity, unitPrice } = await request.json();
        if (!name || !type || !quantity || !unitPrice) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        const equipment = await prisma.equipment.create({
            data: {
                name,
                type,
                quantity,
                unitPrice
            }
        })
        return NextResponse.json({ message: "Equipment created successfully", equipment }, { status: 201 });

    } catch (error) {
        console.error("Error creating equipment:", error);
        return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 });
    }
}
