import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get all leads
export async function GET() {
    try {
        const leads = await prisma.leads.findMany();
        if (leads.length === 0) {
            return NextResponse.json({ error: "No leads found" }, { status: 404 });
        }

        return NextResponse.json({ message: "All leads fetched successfully", leads });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}


// add lead
export async function POST(request: Request) {
    try {
        const { customerId, status, estimatedBill } = await request.json();
        if (!customerId || !status || !estimatedBill) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        const lead = await prisma.leads.create({
            data: {
                customerId,
                status,
                estimatedBill
            }
        })
        return NextResponse.json({ message: "Lead created successfully", lead }, { status: 201 });

    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
    }
}
