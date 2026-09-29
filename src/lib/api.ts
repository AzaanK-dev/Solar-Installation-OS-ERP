import type {
  Customer, CustomerInput, Lead, LeadInput, Survey, SurveyInput, Equipment, EquipmentInput,
  Quotation, QuotationCreateInput, QuotationItem, QuotationStatus, Job, JobInput, JobStatus, DashboardResponse,
} from "@/types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function req<R>(path: string, method = "GET", body?: unknown): Promise<R> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error("Cannot reach the API. Check NEXT_PUBLIC_API_URL and CORS.");
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch { /* non-JSON */ }

  if (!res.ok) {
    const m = data?.error ?? data?.message;
    throw new Error(typeof m === "string" ? m : m ? JSON.stringify(m) : `Request failed (${res.status})`);
  }
  if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) return data.data as R;
  return data as R;
}


const crud = <Row, In>(base: string, update: "PUT" | "PATCH") => ({
  list: () => req<Row[]>(base),
  get: (id: number) => req<Row>(`${base}/${id}`),
  create: (b: In) => req<Row>(base, "POST", b),
  update: (id: number, b: Partial<In>) => req<Row>(`${base}/${id}`, update, b),
  remove: (id: number) => req<unknown>(`${base}/${id}`, "DELETE"),
});




export const api = {
  customers: {
    list: async () => {
      const response = await req<{ customers: Customer[] }>("/api/customers");
      return response.customers;
    },

    get: (id: number) =>
      req<Customer>(`/api/customers/${id}`),

    create: (data: CustomerInput) =>
      req<Customer>("/api/customers", "POST", data),

    update: (id: number, data: Partial<CustomerInput>) =>
      req<Customer>(`/api/customers/${id}`, "PUT", data),

    remove: (id: number) =>
      req<unknown>(`/api/customers/${id}`, "DELETE"),
  },


  leads: crud<Lead, LeadInput>("/api/leads", "PUT"),
  surveys: crud<Survey, SurveyInput>("/api/site-surveys", "PATCH"),
  equipment: crud<Equipment, EquipmentInput>("/api/equipment", "PUT"),

  quotations: {
    list: () => req<Quotation[]>("/api/quotations"),
    get: (id: number) => req<Quotation>(`/api/quotations/${id}`),
    create: (b: QuotationCreateInput) => req<Quotation>("/api/quotations", "POST", b),
    setStatus: (id: number, status: QuotationStatus) => req<Quotation>(`/api/quotations/${id}/status`, "PATCH", { status }),
    remove: (id: number) => req<unknown>(`/api/quotations/${id}`, "DELETE"),
    addItem: (id: number, b: { equipmentId: number; quantity: number }) => req<QuotationItem>(`/api/quotations/${id}/items`, "POST", b),
    updateItem: (id: number, itemId: number, b: { quantity: number }) => req<QuotationItem>(`/api/quotations/${id}/items/${itemId}`, "PATCH", b),
    removeItem: (id: number, itemId: number) => req<unknown>(`/api/quotations/${id}/items/${itemId}`, "DELETE"),
  },
  jobs: {
    list: () => req<Job[]>("/api/jobs"),
    get: (id: number) => req<Job>(`/api/jobs/${id}`),
    create: (b: JobInput) => req<Job>("/api/jobs", "POST", b),
    setStatus: (id: number, status: JobStatus) => req<Job>(`/api/jobs/${id}/status`, "PATCH", { status }),
    remove: (id: number) => req<unknown>(`/api/jobs/${id}`, "DELETE"),
  },
  dashboard: () => req<DashboardResponse>("/api/dashboard"),
};
