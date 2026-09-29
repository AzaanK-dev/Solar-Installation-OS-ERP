import QuotationDetail from "@/components/quotations/QuotationDetail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuotationDetail id={Number(id)} />;
}
