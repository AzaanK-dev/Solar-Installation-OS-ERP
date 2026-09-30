export type LeadStatus = "NEW" | "SURVEYED" | "QUOTED" | "CONVERTED";
export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "CONVERTED";
export type JobStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";

export const LEAD_STATUSES: LeadStatus[] = ["NEW", "SURVEYED", "QUOTED", "CONVERTED"];
export const QUOTATION_STATUSES: QuotationStatus[] = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "CONVERTED"];
export const JOB_STATUSES: JobStatus[] = ["SCHEDULED", "IN_PROGRESS", "COMPLETED"];
export const EQUIPMENT_TYPES = ["Solar Panel", "Inverter", "Battery", "Mounting Equipment"];
export const LOW_STOCK_THRESHOLD = 5; // UI highlight only

export interface Customer { 
    id: number; 
    name: string; 
    email: string; 
    contact: string; 
    address: string; 
    createdAt: string 
}
export type CustomerInput = Omit<Customer, "id" | "createdAt">;

export interface Lead { 
    id: number; 
    customerId: number; 
    status: LeadStatus; 
    estimatedBill: number; 
    createdAt: string; 
    customer?: Customer 
}
export interface LeadInput { 
    customerId: number; 
    estimatedBill: number; 
    status?: LeadStatus 
}

export interface Survey { 
    id: number; 
    leadId: number; 
    area: number; 
    createdAt: string 
}
export interface SurveyInput { 
    leadId: number; 
    area: number 
}

export interface Equipment { 
    id: number; 
    name: string; 
    type: string; 
    quantity: number; 
    unitPrice: number; 
    createdAt: string 
}
export type EquipmentInput = Omit<Equipment, "id" | "createdAt">;

export interface QuotationItem { 
    id: number; 
    quotationId: number; 
    equipmentId: number; 
    quantity: number; 
    unitPrice: number; 
    subtotal: number; 
    equipment?: Equipment 
}
export interface Quotation { 
    id: number; 
    leadId: number; 
    totalPrice: number; 
    status: QuotationStatus; 
    createdAt: string; 
    quotationItem?: QuotationItem[] 
}
export interface QuotationCreateInput { 
    leadId: number; 
    items: { equipmentId: number; quantity: number }[] 
}

export interface Job { 
    id: number; 
    quotationId: number; 
    scheduledDate: string; 
    status: JobStatus; 
    createdAt: string 
}
export interface JobInput { 
    quotationId: number; 
    scheduledDate: string 
}

// Dashboard shape is normalised in components/dashboard/Dashboard.tsx
export type DashboardResponse = Record<string, unknown>;
