import SurveyDetail from "@/components/surveys/SurveyDetail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SurveyDetail id={Number(id)} />;
}
