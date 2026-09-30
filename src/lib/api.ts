import type {
  Customer,
  CustomerInput,
  Lead,
  LeadInput,
  Survey,
  SurveyInput,
  Equipment,
  EquipmentInput,
  Quotation,
  QuotationCreateInput,
  QuotationItem,
  QuotationStatus,
  Job,
  JobInput,
  JobStatus,
  DashboardResponse,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ""


async function request<R>(path: string, method: string = "GET", body?: unknown): Promise<R> {
  const response = await fetch(BASE + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,   // converts JS object into a JSON string.
    cache: "no-store"
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Something went wrong")
  }
  return data as R;
}


export const api = {
  customers: {
    list: async (): Promise<Customer[]> => {
      const response = await request<{ customers: Customer[] }>("/api/customers")
      return response.customers
    },
    get: async (id: number): Promise<Customer> => {
      const response = await request<{ customer: Customer }>(`/api/customers/${id}`)
      return response.customer
    },
    create: async (data: CustomerInput): Promise<Customer> => {
      const response = await request<{ customer: Customer }>("/api/customers", "POST", data)
      return response.customer
    },
    update: async (id: number, data: Partial<CustomerInput>): Promise<Customer> => {
      const response = await request<{ customer: Customer }>(`/api/customers/${id}`, "PATCH", data)
      return response.customer
    },
    delete: async (id: number) => {
      await request(`/api/customers/${id}`, "DELETE")
    },
  },

  leads: {
    list: async (): Promise<Lead[]> => {
      const response = await request<{ leads: Lead[] }>("/api/leads")
      return response.leads
    },
    get: async (id:number) => {
      const response = await request<{ lead: Lead }>(`/api/leads/${id}`)
      return response.lead
    },
    create: async (data: LeadInput): Promise<Lead> => {
      const response = await request<{ lead: Lead }>("/api/leads", "POST", data)
      return response.lead
    },
    update: async (id: number, data: Partial<LeadInput>): Promise<Lead> => {
      const response = await request<{ lead: Lead }>(`/api/leads/${id}`, "PATCH", data)
      return response.lead
    },
    delete: async (id: number) => {
      await request(`/api/leads/${id}`, "DELETE")
    },
  },

  surveys: {
    list: async (): Promise<Survey[]> => {
      const response = await request<{ siteSurveys: Survey[] }>("/api/site-surveys")
      return response.siteSurveys
    },
    get: async (id:number) => {
      const response = await request<{ siteSurvey: Survey }>(`/api/site-surveys/${id}`)
      return response.siteSurvey
    },
    create: async (data: SurveyInput): Promise<Survey> => {
      const response = await request<{ siteSurvey: Survey }>("/api/site-surveys", "POST", data)
      return response.siteSurvey
    },
    update: async (id: number, data: Partial<SurveyInput>): Promise<Survey> => {
      const response = await request<{ siteSurvey: Survey }>(`/api/site-surveys/${id}`, "PATCH", data)
      return response.siteSurvey
    },
    delete: async (id: number) => {
      await request(`/api/site-surveys/${id}`, "DELETE")
    },
  },

  equipment: {
    list: async (): Promise<Equipment[]> => {
      const response = await request<{ equipment: Equipment[] }>("/api/equipment")
      return response.equipment
    },
    get: async (id:number) => {
      const response = await request<{ equipment: Equipment }>(`/api/equipment/${id}`)
      return response.equipment
    },
    create: async (data: EquipmentInput): Promise<Equipment> => {
      const response = await request<{ equipment: Equipment }>("/api/equipment", "POST", data)
      return response.equipment
    },
    update: async (id: number, data: Partial<EquipmentInput>): Promise<Equipment> => {
      const response = await request<{ equipment: Equipment }>(`/api/equipment/${id}`, "PATCH", data)
      return response.equipment
    },
    delete: async (id: number) => {
      await request(`/api/equipment/${id}`, "DELETE")
    },
  },

  quotations: {
    list: async (): Promise<Quotation[]> => {
      const response = await request<{ quotations: Quotation[] }>("/api/quotations")
      return response.quotations
    },
    get: async (id:number) => {
      const response = await request<{ quotation: Quotation }>(`/api/quotations/${id}`)
      return response.quotation
    },
    create: async (data: QuotationCreateInput): Promise<Quotation> => {
      const response = await request<{ quotation: Quotation }>("/api/quotations", "POST", data)
      return response.quotation
    },
    delete: async (id: number) => {
      await request(`/api/quotations/${id}`, "DELETE")
    },
    changeStatus: async (id: number, status: QuotationStatus): Promise<Quotation> => {
      const response = await request<{quotation: Quotation}>(`/api/quotations/${id}/status`, "PATCH", { status })
      return response.quotation
    },
    addItem: async (id: number, data: { equipmentId: number; quantity: number }): Promise<QuotationItem> => {
      const response = await request<{ item: QuotationItem }>(`/api/quotations/${id}/items`, "POST", data)
      return response.item
    },
    updateItem: async (id: number, itemId: number, data: { quantity: number }): Promise<QuotationItem> => {
      const response = await request<{ item: QuotationItem }>(`/api/quotations/${id}/items/${itemId}`, "PATCH", data)
      return response.item
    },
    deleteItem: async (id: number, itemId: number) => {
      await request(`/api/quotations/${id}/items/${itemId}`, "DELETE")
    },
  },

  jobs: {
    list: async (): Promise<Job[]> => {
      const response = await request<{ jobs: Job[] }>("/api/jobs")
      return response.jobs
    },
    get: async (id:number) => {
      const response = await request<{ job: Job }>(`/api/jobs/${id}`)
      return response.job
    },
    create: async (data: JobInput): Promise<Job> => {
      const response = await request<{ job: Job }>("/api/jobs", "POST", data)
      return response.job
    },
    delete: async (id: number) => {
      await request(`/api/jobs/${id}`, "DELETE")
    },
    changeStatus: async (id: number, status: JobStatus): Promise<Job> => {
      const response = await request<{job: Job}>(`/api/jobs/${id}/status`, "PATCH", { status })
      return response.job
    },
  },

  dashboard: async (): Promise<DashboardResponse> => {
    const response = await request<DashboardResponse>("/api/dashboard")
    return response
  },
}