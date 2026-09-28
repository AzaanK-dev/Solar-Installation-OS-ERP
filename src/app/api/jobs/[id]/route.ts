import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ id:string }> }){
    try{
        const {id} = await params;
        const job = await prisma.installationJobs.findUnique({ where: {id: Number(id)} })  
        if(!job)  return NextResponse.json({ error: "Job not found" }, { status: 404 });

        return NextResponse.json({ message: "Job fetched successfully", job }, { status: 200 });
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id:string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        
        await prisma.installationJobs.delete({where: { id: Number(id) }})
        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}
