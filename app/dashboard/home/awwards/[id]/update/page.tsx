import AwardUpdateForm from "@/components/dashboard/awards/award-update-form";

interface UpdateAwardPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateAwardPage({ params }: UpdateAwardPageProps) {
  const { id } = await params;

  return <AwardUpdateForm id={id} />;
}
