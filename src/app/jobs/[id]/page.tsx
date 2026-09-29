import JobDetail from "@/components/jobs/JobDetail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobDetail id={Number(id)} />;
}
