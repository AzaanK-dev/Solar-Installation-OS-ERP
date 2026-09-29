// import type {
//   Customer, CustomerInput, Lead, LeadInput, Survey, SurveyInput, Equipment, EquipmentInput,
//   Quotation, QuotationCreateInput, QuotationItem, QuotationStatus, Job, JobInput, JobStatus, DashboardResponse,
// } from "@/types";

// const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

// async function req<R>(path: string, method = "GET", body?: unknown): Promise<R> {
//   let res: Response;
//   try {
//     res = await fetch(BASE + path, {
//       method,
//       headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
//       body: body !== undefined ? JSON.stringify(body) : undefined,
//       cache: "no-store",
//     });
//   } catch {
//     throw new Error("Cannot reach the API. Check NEXT_PUBLIC_API_URL and CORS.");
//   }

//   const text = await res.text();
//   let data: any = null;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch { /* non-JSON */ }

//   if (!res.ok) {
//     const m = data?.error ?? data?.message;
//     throw new Error(typeof m === "string" ? m : m ? JSON.stringify(m) : `Request failed (${res.status})`);
//   }
//   if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) return data.data as R;
//   return data as R;
// }


// const crud = <Row, In>(base: string, update: "PUT" | "PATCH") => ({
//   list: () => req<Row[]>(base),
//   get: (id: number) => req<Row>(`${base}/${id}`),
//   create: (b: In) => req<Row>(base, "POST", b),
//   update: (id: number, b: Partial<In>) => req<Row>(`${base}/${id}`, update, b),
//   remove: (id: number) => req<unknown>(`${base}/${id}`, "DELETE"),
// });




// export const api = {
//   customers: {
//     list: async () => {
//       const response = await req<{ customers: Customer[] }>("/api/customers");
//       return response.customers;
//     },
//     get: (id: number) =>
//       req<Customer>(`/api/customers/${id}`),

//     create: (data: CustomerInput) =>
//       req<Customer>("/api/customers", "POST", data),

//     update: (id: number, data: Partial<CustomerInput>) =>
//       req<Customer>(`/api/customers/${id}`, "PUT", data),

//     remove: (id: number) =>
//       req<unknown>(`/api/customers/${id}`, "DELETE"),
//   },


//   leads: {
//     list: async () => {
//       const response = await req<{ leads: Lead[] }>("/api/leads");
//       return response.leads;
//     },
//     get: (id: number) =>
//       req<Lead>(`/api/leads/${id}`),

//     create: (data: LeadInput) =>
//       req<Lead>("/api/leads", "POST", data),

//     update: (id: number, data: Partial<LeadInput>) =>
//       req<Lead>(`/api/leads/${id}`, "PUT", data),

//     remove: (id: number) =>
//       req<unknown>(`/api/leads/${id}`, "DELETE"),
//   },
//   surveys: crud<Survey, SurveyInput>("/api/site-surveys", "PATCH"),
//   equipment: crud<Equipment, EquipmentInput>("/api/equipment", "PUT"),

//   quotations: {
//     list: () => req<Quotation[]>("/api/quotations"),
//     get: (id: number) => req<Quotation>(`/api/quotations/${id}`),
//     create: (b: QuotationCreateInput) => req<Quotation>("/api/quotations", "POST", b),
//     setStatus: (id: number, status: QuotationStatus) => req<Quotation>(`/api/quotations/${id}/status`, "PATCH", { status }),
//     remove: (id: number) => req<unknown>(`/api/quotations/${id}`, "DELETE"),
//     addItem: (id: number, b: { equipmentId: number; quantity: number }) => req<QuotationItem>(`/api/quotations/${id}/items`, "POST", b),
//     updateItem: (id: number, itemId: number, b: { quantity: number }) => req<QuotationItem>(`/api/quotations/${id}/items/${itemId}`, "PATCH", b),
//     removeItem: (id: number, itemId: number) => req<unknown>(`/api/quotations/${id}/items/${itemId}`, "DELETE"),
//   },
//   jobs: {
//     list: () => req<Job[]>("/api/jobs"),
//     get: (id: number) => req<Job>(`/api/jobs/${id}`),
//     create: (b: JobInput) => req<Job>("/api/jobs", "POST", b),
//     setStatus: (id: number, status: JobStatus) => req<Job>(`/api/jobs/${id}/status`, "PATCH", { status }),
//     remove: (id: number) => req<unknown>(`/api/jobs/${id}`, "DELETE"),
//   },
//   dashboard: () => req<DashboardResponse>("/api/dashboard"),
// };





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

  equipments: {
    list: async (): Promise<Equipment[]> => {
      const response = await request<{ equipments: Equipment[] }>("/api/equipment")
      return response.equipments
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
      const response = await request<{quotation: Quotation}>(`/api/quotations/${id}/status`, "PATCH", status)
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
      const response = await request<{job: Job}>(`/api/jobs/${id}/status`, "PATCH", status)
      return response.job
    },
  },

  dashboard: async (): Promise<DashboardResponse> => {
    const response = await request<DashboardResponse>("/api/dashboard")
    return response
  },
}