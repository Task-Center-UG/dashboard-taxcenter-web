import ResearchCategoryUpdateForm from "@/components/dashboard/research-category/research-category-update-form";

interface UpdateResearchCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateResearchCategoryPage({ params }: UpdateResearchCategoryPageProps) {
  const { id } = await params;

  return <ResearchCategoryUpdateForm id={id} />;
}
