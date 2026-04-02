import MbkmRegistrationDetail from "@/components/dashboard/mbkm-registration/mbkm-registration-detail";

interface MbkmDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MbkmDetailPage({
  params,
}: MbkmDetailPageProps) {
  const { id } = await params;

  return <MbkmRegistrationDetail id={id} />;
}
