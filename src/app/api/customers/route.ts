import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get all customers
export async function GET() {
    try {
        const customers = await prisma.customers.findMany();
        if (!customers) {
            return NextResponse.json({ error: "No customers found" }, { status: 404 });
        }

        return NextResponse.json({ message: "All Customers fetched successfully", customers});
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}


// add customer
export async function POST(request: Request) {
    try {
        const { name, email, contact, address } = await request.json();
        if (!name || !email || !contact || !address) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        const customer = await prisma.customers.create({
            data: {
                name,
                email,
                contact,
                address
            }
        })
        if (!customer) return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
        return NextResponse.json({ message: "Customer created successfully", customer }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating customer:", error);
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }
}
