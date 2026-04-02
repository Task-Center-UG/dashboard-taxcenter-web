import SeminarUpdateForm from "@/components/dashboard/seminar/seminar-update-form";

interface UpdateSeminarPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateSeminarPage({ params }: UpdateSeminarPageProps) {
  const { id } = await params;

  return <SeminarUpdateForm id={id} />;
}
