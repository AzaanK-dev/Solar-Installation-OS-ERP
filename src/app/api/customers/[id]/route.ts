import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET({ params }: { params: Promise<{ id:string }> }){
    try{
        const {id} = await params;
        const customer = await prisma.customers.findUnique({ where: {id: Number(id)} })
        if(!customer)  return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        return NextResponse.json({ message: "Customer fetched successfully", customer }, { status: 200 });
    } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        const body = await request.json();
        if(!body)  return NextResponse.json({ error: "Fields are required for updating customer" }, { status: 400 });
        
        const updateFields = Object.entries(body).filter(([_,val]) => val !== undefined)  // convert body obj into array and filterd out undefined values
        const updatedData = Object.fromEntries(updateFields)  
        
        const customer = await prisma.customers.update({
            where: { id: Number(id) },
            data: updatedData
        })
        return NextResponse.json({ message: "Customer updated successfully", customer }, { status: 200 });
    } catch (error) {
        console.error("Error updating customer:", error);
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
}


export async function DELETE({ params }: { params: Promise<{ id:string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        
        await prisma.customers.delete({where: { id: Number(id) }})
        return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting customer:", error);
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}
