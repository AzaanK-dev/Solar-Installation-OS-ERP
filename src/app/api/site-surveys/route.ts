import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const siteSurveys = await prisma.siteSurveys.findMany();
        if (siteSurveys.length === 0) {
            return NextResponse.json({ error: "No site-surveys found" }, { status: 404 });
        }
        return NextResponse.json({ message: "All site-surveys fetched successfully", siteSurveys });
    } catch (error) {
        console.error("Error fetching site-surveys:", error);
        return NextResponse.json({ error: "Failed to fetch site-surveys" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const { leadId, area } = await request.json();
        if (!leadId || !area) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        const siteSurvey = await prisma.siteSurveys.create({
            data: {
                leadId, 
                area
            }
        })
        return NextResponse.json({ message: "Site-survey created successfully", siteSurvey }, { status: 201 });

    } catch (error) {
        console.error("Error creating siteSurvey:", error);
        return NextResponse.json({ error: "Failed to create site-survey" }, { status: 500 });
    }
}
