import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
    try{
        const customersCount = await prisma.customers.count();
        const leadsCountByStatus = await prisma.leads.groupBy({
            by: ['status'],
            _count: true,
        });
        const siteSurveysCount = await prisma.siteSurveys.count();
        const quotationsCountByStatus = await prisma.quotations.groupBy({
            by: ['status'],
            _count: true,
        });
        const jobsCountByStatus = await prisma.installationJobs.groupBy({
            by: ['status'],
            _count: true,
        });
        const lowStockEquipments = await prisma.equipment.findMany({
            where: {
                quantity: { lte: 5 }    // lte: less than or equal to 5
            }
        });

        // convert arrays to objects
        const leadsCount = leadsCountByStatus.reduce((acc, item) => {  
            acc[item.status] = item._count;
            return acc;
        }, {} as Record<string, number>);
        const quotationsCount = quotationsCountByStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
        }, {} as Record<string, number>);
        const jobsCount = jobsCountByStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
        }, {} as Record<string, number>);



        return NextResponse.json({
            customersCount,
            leadsCount,
            siteSurveysCount,
            quotationsCount,
            jobsCount,   
            lowStockEquipments   // arr
        }, { status: 200 });

    }catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}