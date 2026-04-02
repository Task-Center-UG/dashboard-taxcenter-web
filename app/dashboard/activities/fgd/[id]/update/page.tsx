import FgdUpdateForm from "@/components/dashboard/fgd/fgd-update-form";

interface UpdateFgdPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateFgdPage({ params }: UpdateFgdPageProps) {
  const { id } = await params;

  return <FgdUpdateForm id={id} />;
}
