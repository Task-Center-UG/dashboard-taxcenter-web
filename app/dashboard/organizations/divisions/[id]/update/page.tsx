import DivisionUpdateForm from "@/components/dashboard/divisions/division-update-form";

interface UpdateDivisionPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateDivisionPage({
  params,
}: UpdateDivisionPageProps) {
  const { id } = await params;

  return <DivisionUpdateForm id={id} />;
}
