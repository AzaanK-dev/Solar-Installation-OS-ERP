import EquipmentDetail from "@/components/equipment/EquipmentDetail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EquipmentDetail id={Number(id)} />;
}
