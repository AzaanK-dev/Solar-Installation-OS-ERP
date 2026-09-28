import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get all installationJobs
export async function GET() {
    try {
        const jobs = await prisma.installationJobs.findMany();
        if (jobs.length === 0) {
            return NextResponse.json({ error: "No Jobs found" }, { status: 404 });
        }

        return NextResponse.json({ message: "All Jobs fetched successfully", jobs });
    } catch (error) {
        console.error("Error fetching Jobs:", error);
        return NextResponse.json({ error: "Failed to fetch Jobs" }, { status: 500 });
    }
}


// add installationJob
export async function POST(request: Request) {
    try {
        const { quotationId, status, scheduledDate } = await request.json();
        if (!quotationId || !status || !scheduledDate) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
         
        const job = await prisma.installationJobs.create({
            data: {
                quotationId: Number(quotationId),
                status: status,
                scheduledDate: new Date(scheduledDate)
            }
        })
        return NextResponse.json({ message: "Job created successfully", job }, { status: 201 });

    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
