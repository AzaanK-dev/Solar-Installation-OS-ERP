import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ id:string }> }){
    try{
        const {id} = await params;
        const siteSurvey = await prisma.siteSurveys.findUnique({ where: {id: Number(id)} })  
        if(!siteSurvey)  return NextResponse.json({ error: "Site-survey not found" }, { status: 404 });

        return NextResponse.json({ message: "Site-survey fetched successfully", siteSurvey }, { status: 200 });
    } catch (error) {
        console.error("Error fetching site-survey:", error);
        return NextResponse.json({ error: "Failed to fetch site-survey" }, { status: 500 });
    }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Site-survey ID is required" }, { status: 400 });
        const body = await request.json();  
        
        const updateFields = Object.entries(body).filter(([_,val]) => val !== undefined)  // convert body obj into array and filterd out undefined values
        const updatedData = Object.fromEntries(updateFields)  
        const siteSurvey = await prisma.siteSurveys.update({
            where: { id: Number(id) },
            data: updatedData
        })
        return NextResponse.json({ message: "Site-survey updated successfully", siteSurvey }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating site-survey:", error);
        return NextResponse.json({ error: "Failed to update site-survey" }, { status: 500 });
    }
}


export async function DELETE({ params }: { params: Promise<{ id:string }> }) {
    try {
        const { id } = await params;
        if (!id)  return NextResponse.json({ error: "Site-survey ID is required" }, { status: 400 });
        
        await prisma.siteSurveys.delete({where: { id: Number(id) }})
        return NextResponse.json({ message: "Site-survey deleted successfully" }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting site-survey:", error);
        return NextResponse.json({ error: "Failed to delete site-survey" }, { status: 500 });
    }
}
