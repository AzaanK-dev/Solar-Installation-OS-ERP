import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ id:string }> }){
    try{
        const {id} = await params;
        const equipment = await prisma.equipment.findUnique({ where: {id: Number(id)} })  
        if(!equipment)  return NextResponse.json({ error: "Equipment not found" }, { status: 404 });

        return NextResponse.json({ message: "Equipment fetched successfully", equipment }, { status: 200 });
    } catch (error) {
        console.error("Error fetching equipment:", error);
        return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
    }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Equipment ID is required" }, { status: 400 });
        const body = await request.json();  
        
        const updateFields = Object.entries(body).filter(([_,val]) => val !== undefined)  // convert body obj into array and filterd out undefined values
        const updatedData = Object.fromEntries(updateFields)  
        const equipment = await prisma.equipment.update({
            where: { id: Number(id) },
            data: updatedData
        })
        return NextResponse.json({ message: "Equipment updated successfully", equipment }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating equipment:", error);
        return NextResponse.json({ error: "Failed to update equipment" }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id:string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Equipment ID is required" }, { status: 400 });
        
        await prisma.equipment.delete({where: { id: Number(id) }})
        return NextResponse.json({ message: "Equipment deleted successfully" }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting equipment:", error);
        return NextResponse.json({ error: "Failed to delete equipment" }, { status: 500 });
    }
}
