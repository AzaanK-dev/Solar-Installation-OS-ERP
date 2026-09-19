import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET({ params }: { params: Promise<{ id:string }> }){
    try{
        const {id} = await params;
        const lead = await prisma.leads.findUnique({ where: {id: Number(id)} })  // Prisma findUnique() → null → use if (!record)
        if(!lead)  return NextResponse.json({ error: "Lead not found" }, { status: 404 });

        return NextResponse.json({ message: "Lead fetched successfully", lead }, { status: 200 });
    } catch (error) {
        console.error("Error fetching lead:", error);
        return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
    }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "lead ID is required" }, { status: 400 });
        const body = await request.json();
        if(!body)  return NextResponse.json({ error: "Fields are required for updating lead" }, { status: 400 });
        
        const updateFields = Object.entries(body).filter(([_,val]) => val !== undefined)  // convert body obj into array and filterd out undefined values
        const updatedData = Object.fromEntries(updateFields)  
        const lead = await prisma.leads.update({
            where: { id: Number(id) },
            data: updatedData
        })
        return NextResponse.json({ message: "lead updated successfully", lead }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }
}


export async function DELETE({ params }: { params: Promise<{ id:string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "lead ID is required" }, { status: 400 });
        
        await prisma.leads.delete({where: { id: Number(id) }})
        return NextResponse.json({ message: "lead deleted successfully" }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting lead:", error);
        return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }
}
