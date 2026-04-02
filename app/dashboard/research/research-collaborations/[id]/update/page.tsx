import ResearchUpdateForm from "@/components/dashboard/research/research-update-form";

interface UpdateResearchPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateResearchPage({ params }: UpdateResearchPageProps) {
  const { id } = await params;

  return <ResearchUpdateForm id={id} />;
}
